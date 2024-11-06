import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Mark route as dynamic since it depends on request parameters
export const dynamic = "force-dynamic";

// Helper function to ensure the favorites collection exists
async function ensureFavoritesCollection(db) {
  const collections = await db.listCollections({ name: "favorites" }).toArray();
  if (collections.length === 0) {
    await db.createCollection("favorites");
  }
}

/**
 * Generates a new user ID and ensures it exists in the database
 * @param {Db} db - MongoDB database instance
 * @returns {string} - The new user ID
 */
async function generateUserId(db) {
  const userId = crypto.randomUUID();
  // You can add logic here if you want to track users in a separate collection
  return userId;
}

/**
 * GET - Retrieve the count or list of user's favorite recipes
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    let userId = request.headers.get("userId");

    const client = await clientPromise;
    const db = client.db("devdb");

    // Ensure the favorites collection exists
    await ensureFavoritesCollection(db);

    // Generate a new userId if one was not provided
    if (!userId) {
      userId = await generateUserId(db);
    }

    if (action === "count") {
      const count = await db.collection("favorites").countDocuments({ userId });
      return NextResponse.json({ count, userId });
    } else {
      const favorites = await db.collection("favorites").find({ userId }).toArray();
      return NextResponse.json({ favorites, userId });
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Error fetching favorites" }, { status: 500 });
  }
}

/**
 * POST - Add a recipe to user's favorites
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const { recipeId } = await request.json();
    let userId = request.headers.get("userId");

    const client = await clientPromise;
    const db = client.db("devdb");

    // Ensure the favorites collection exists
    await ensureFavoritesCollection(db);

    // Generate a new userId if one was not provided
    if (!userId) {
      userId = await generateUserId(db);
    }

    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    const existingFavorite = await db.collection("favorites").findOne({ userId, recipeId });
    if (existingFavorite) {
      return NextResponse.json({ message: "Recipe already in favorites", userId });
    }

    await db.collection("favorites").insertOne({ userId, recipeId });
    return NextResponse.json({ message: "Recipe added to favorites", userId });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json({ error: "Error adding to favorites" }, { status: 500 });
  }
}

