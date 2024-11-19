import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listId } = params;
    const { items } = await request.json();

    const client = await clientPromise;
    const db = client.db("devdb");

    // Verify list ownership
    const list = await db.collection("shopping_lists").findOne({
      _id: new ObjectId(listId),
      userId: session.user.id,
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Update the list
    const result = await db.collection("shopping_lists").updateOne(
      { _id: new ObjectId(listId) },
      {
        $set: {
          items,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update list" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating shopping list:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
