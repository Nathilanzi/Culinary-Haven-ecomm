import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();
    const client = await clientPromise;
    const db = client.db("devdb");

    const shoppingList = {
      userId: session.user.id,
      items: items.map((item) => ({
        ...item,
        purchased: false,
        addedAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("shopping_lists")
      .insertOne(shoppingList);
    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const lists = await db
      .collection("shopping_lists")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(lists);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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