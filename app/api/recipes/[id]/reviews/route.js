import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Validate review data
function validateReview(review) {
  const { rating, comment, username } = review;
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return { valid: false, error: "Invalid rating" };
  }
  if (!username?.trim()) {
    return { valid: false, error: "Username is required" };
  }
  if (comment && typeof comment !== 'string') {
    return { valid: false, error: "Invalid comment format" };
  }
  return { valid: true };
}

// Helper function to update recipe average rating
async function updateRecipeRating(db, recipeId) {
  const pipeline = [
    { $match: { _id: ObjectId(recipeId) } },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$_id",
        averageRating: { $avg: "$reviews.rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ];

  const result = await db.collection("recipes").aggregate(pipeline).toArray();

  if (result.length > 0) {
    await db.collection("recipes").updateOne(
      { _id: ObjectId(recipeId) },
      {
        $set: {
          averageRating: Number(result[0].averageRating.toFixed(1)),
          reviewCount: result[0].reviewCount
        }
      }
    );
  }
}

// GET all reviews for a recipe, sorted by given criteria
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const client = await clientPromise;
    const db = client.db("devdb");

    const recipe = await db.collection("recipes").findOne(
      { _id: ObjectId(params.id) }
    );

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    let reviews = recipe.reviews || [];

    // Sort reviews
    reviews.sort((a, b) => {
      const factor = order === "asc" ? 1 : -1;
      if (sortBy === "rating") {
        return (a.rating - b.rating) * factor;
      }
      return (new Date(a.createdAt) - new Date(b.createdAt)) * factor;
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Error fetching reviews" },
      { status: 500 }
    );
  }
}

// POST a new review to a recipe, only if reviews do not exist
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const validation = validateReview(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    // Find the recipe document
    const recipe = await db.collection("recipes").findOne(
      { _id: ObjectId(params.id) }
    );

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Check if the recipe has reviews
    if (recipe.reviews && recipe.reviews.length > 0) {
      return NextResponse.json(
        { message: "Reviews already exist, skipping creation" }
      );
    }

    // Create the new review if no reviews exist
    const review = {
      _id: new ObjectId(),
      username: body.username.trim(),
      rating: body.rating,
      comment: body.comment?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection("recipes").updateOne(
      { _id: ObjectId(params.id) },
      { $push: { reviews: review } }
    );

    await updateRecipeRating(db, params.id);

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Error adding review" },
      { status: 500 }
    );
  }
}

// PUT to update an existing review for a recipe
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const validation = validateReview(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const result = await db.collection("recipes").updateOne(
      {
        _id: ObjectId(params.id),
        "reviews._id": ObjectId(body.reviewId)
      },
      {
        $set: {
          "reviews.$.username": body.username.trim(),
          "reviews.$.rating": body.rating,
          "reviews.$.comment": body.comment?.trim() || "",
          "reviews.$.updatedAt": new Date(),
          "reviews.$.createdAt": body.createdAt
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    await updateRecipeRating(db, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Error updating review" },
      { status: 500 }
    );
  }
}

// DELETE a review from a recipe
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const result = await db.collection("recipes").updateOne(
      { _id: ObjectId(params.id) },
      { $pull: { reviews: { _id: ObjectId(reviewId) } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    await updateRecipeRating(db, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Error deleting review" },
      { status: 500 }
    );
  }
}
