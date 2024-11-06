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

