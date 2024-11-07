// Endpoint to get recommended recipes sorted by average rating
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

// Helper function to calculate the average rating of a recipe
async function calculateAverageRating(recipeId) {
  const client = await clientPromise;
  const db = client.db("devdb");

  // Fetch all reviews for the given recipe
  const reviews = await db.collection("reviews").find({ recipeId }).toArray();

  if (reviews.length === 0) return null;  // No reviews, so return null for no average rating

  // Calculate the average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
}

// Endpoint to fetch top-rated recipes
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    // Fetch only recipes with an average rating greater than 0
    const recipes = await db.collection("recipes")
      .find({ averageRating: { $exists: true, $gt: 0 } })
      .sort({ averageRating: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

// Watcher for changes in reviews to update the recipe's average rating
export async function updateAverageRatingOnReviewChange(recipeId) {
  const client = await clientPromise;
  const db = client.db("devdb");

  // Calculate the new average rating
  const newAverageRating = await calculateAverageRating(recipeId);

  // Update the recipe's average rating if there are reviews; otherwise, remove the field
  if (newAverageRating !== null) {
    await db.collection("recipes").updateOne(
      { _id: recipeId },
      { $set: { averageRating: newAverageRating } }
    );
  } else {
    await db.collection("recipes").updateOne(
      { _id: recipeId },
      { $unset: { averageRating: "" } }
    );
  }
}
