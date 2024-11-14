import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

/**
 * Force the page to be dynamically generated on each request.
 */
export const dynamic = "force-dynamic";

/**
 * Ensures that the "favorites" collection exists in the database, and creates it if it doesn't.
 * Also creates a unique index on the "userEmail" and "recipeId" fields.
 * @param {MongoDBDatabase} db - The MongoDB database instance.
 * @returns {Promise<void>}
 */
async function ensureFavoritesCollection(db) {
  const collections = await db.listCollections({ name: "favorites" }).toArray();
  if (collections.length === 0) {
    await db.createCollection("favorites");
    await db
      .collection("favorites")
      .createIndex({ userEmail: 1, recipeId: 1 }, { unique: true });
  }
}

/**
 * Handles GET requests to the "/api/favorites" endpoint.
 * @param {IncomingMessage} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} - A NextResponse object with the requested data or an error message.
 */
export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const userEmail = session.user.email;

    const client = await clientPromise;
    const db = client.db("devdb");
    await ensureFavoritesCollection(db);

    if (action === "count") {
      const count = await db
        .collection("favorites")
        .countDocuments({ userEmail });
      return NextResponse.json({ count });
    } else {
      const favorites = await db
        .collection("favorites")
        .find({ userEmail })
        .sort({ created_at: -1 })
        .toArray();
      return NextResponse.json({ favorites });
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Error fetching favorites" },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to the "/api/favorites" endpoint.
 * Adds a new recipe to the user's favorites.
 * @param {IncomingMessage} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} - A NextResponse object with a success or error message.
 */
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await request.json();
    const userEmail = session.user.email;

    const client = await clientPromise;
    const db = client.db("devdb");
    await ensureFavoritesCollection(db);

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    await db.collection("favorites").insertOne({
      userEmail,
      recipeId,
      created_at: new Date(),
    });

    return NextResponse.json({ message: "Recipe added to favorites" });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Recipe already in favorites" });
    }
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { error: "Error adding to favorites" },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to the "/api/favorites" endpoint.
 * Removes a recipe from the user's favorites.
 * @param {IncomingMessage} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} - A NextResponse object with a success or error message.
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await request.json();
    const userEmail = session.user.email;

    const client = await clientPromise;
    const db = client.db("devdb");
    await ensureFavoritesCollection(db);

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const deleteResult = await db
      .collection("favorites")
      .deleteOne({ userEmail, recipeId });
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Error removing from favorites" },
      { status: 500 }
    );
  }
}
