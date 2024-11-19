import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listId } = params;
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid items format" },
        { status: 400 }
      );
    }

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

    // Format new items
    const newItems = items.map((item) => ({
      ...item,
      purchased: false,
      addedAt: new Date(),
    }));

    // Add new items to the list
    const result = await db.collection("shopping_lists").updateOne(
      { _id: new ObjectId(listId) },
      {
        $push: { items: { $each: newItems } },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to add items" },
        { status: 400 }
      );
    }

    // Fetch and return the updated list
    const updatedList = await db.collection("shopping_lists").findOne({
      _id: new ObjectId(listId),
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    console.error("Error adding items to shopping list:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}