import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Mark route as dynamic since it involves database operations
export const dynamic = "force-dynamic";

/**
 * Fetch the top 10 rated recipes.
 * @returns {Promise<NextResponse>} A response containing the top 10 rated recipes.
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    // Get top 10 rated recipes
    const recipes = await db
      .collection("recipes")
      .find({ averageRating: { $exists: true, $gt: 0 } })
      .sort({ averageRating: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
