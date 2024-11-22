/**
 * API Handlers for Shopping List Management
 *
 * @description Provides functionality to add and remove items from a user's shopping list.
 * Includes session-based authentication and list ownership verification.
 */
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Add items to a shopping list.
 *
 * @async
 * @function POST
 * @param {Request} request - The HTTP request object containing the items to be added.
 * @param {Object} context - The context object containing route parameters.
 * @param {string} context.params.id - The ID of the shopping list to update.
 * @returns {NextResponse} - A JSON response with the updated shopping list or an error message.
 *
 * @throws {Error} - Returns a 500 error if an unexpected error occurs.
 *
 * @example
 * POST /api/shopping_lists/{id}
 * Body: { items: [{ name: "Milk", quantity: 1 }] }
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
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
      _id: new ObjectId(id),
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
      { _id: new ObjectId(id) },
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
      _id: new ObjectId(id),
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    console.error("Error adding items to shopping list:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Remove an item from a shopping list by index.
 *
 * @async
 * @function DELETE
 * @param {Request} request - The HTTP request object containing the index of the item to remove.
 * @param {Object} context - The context object containing route parameters.
 * @param {string} context.params.id - The ID of the shopping list to update.
 * @returns {NextResponse} - A JSON response indicating success or an error message.
 *
 * @throws {Error} - Returns a 500 error if an unexpected error occurs.
 *
 * @example
 * DELETE /api/shopping_lists/{id}
 * Body: { index: 0 }
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { index } = await request.json(); // Change from itemId to index

    const client = await clientPromise;
    const db = client.db("devdb");

    // Verify list ownership
    const list = await db.collection("shopping_lists").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Create a copy of items array and remove the item at the specified index
    const updatedItems = list.items.filter(
      (_, itemIndex) => itemIndex !== index
    );

    // Update the document with the new items array
    const result = await db.collection("shopping_lists").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          items: updatedItems,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to remove item" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing item from shopping list:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
