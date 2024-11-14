import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Mark route as dynamic since it involves database operations
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    // Get distinct ingredients from all recipes
    const ingredients = await db.collection("recipes")
      .aggregate([
        // First get all ingredients object keys
        { $project: { ingredients: { $objectToArray: "$ingredients" } } },
        // Unwind the array created by objectToArray
        { $unwind: "$ingredients" },
        // Group by the ingredient key (which will be the ingredient name)
        { $group: { _id: "$ingredients.k" } },
        // Sort alphabetically
        { $sort: { _id: 1 } }
      ]).toArray();

    return NextResponse.json(ingredients.map(ing => ing._id));
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json({ error: "Error fetching ingredients" }, { status: 500 });
  }
}