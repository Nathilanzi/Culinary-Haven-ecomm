import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; 

export async function GET() {
  try {
    const client = await clientPromise; // Connect to MongoDB
    const db = client.db(); // Get the database instance

    // Fetch recipes sorted by average rating, limiting to 10
    const recipes = await db
      .collection("recipes") // Adjust to your actual collection name
      .find()
      .sort({ averageRating: -1 }) // Ensure averageRating is indexed for better performance
      .limit(10)
      .toArray();

    // If no recipes with ratings, fetch quick recipes
    if (!recipes.length) {
      const quickRecipes = await db
        .collection("recipes")
        .find({ preparationTime: { $lte: 20 } })
        .limit(10)
        .toArray();
      return NextResponse.json({ recipes: quickRecipes });
    }

    // Return recipes as JSON response
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
