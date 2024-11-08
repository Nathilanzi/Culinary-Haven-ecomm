import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Generate an ID using timestamp and random string
function generateId() {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}${randomStr}`;
}

// Validate review data
function validateReview(review) {
  const { rating, comment } = review;

  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return { valid: false, error: "Invalid rating" };
  }

  if (comment && typeof comment !== "string") {
    return { valid: false, error: "Invalid comment format" };
  }

  return { valid: true };
}

// Helper function to update recipe average rating
async function updateRecipeRating(db, recipeId) {
  const recipe = await db.collection("recipes").findOne({ _id: recipeId });
  if (recipe && recipe.reviews) {
    const totalRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = recipe.reviews.length > 0 ? 
      Number((totalRating / recipe.reviews.length).toFixed(1)) : 0;

    await db.collection("recipes").updateOne(
      { _id: recipeId },
      {
        $set: {
          averageRating,
          reviewCount: recipe.reviews.length,
        },
      }
    );
  }
}

// GET all reviews for a recipe
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const client = await clientPromise;
    const db = client.db("devdb");

    const recipe = await db.collection("recipes").findOne(
      { _id: params.id },
      { projection: { reviews: 1, averageRating: 1, reviewCount: 1 } }
    );

    if (!recipe) {
      console.error("Recipe not found with ID:", params.id);
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

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    return NextResponse.json({
      reviews: paginatedReviews,
      totalReviews: reviews.length,
      averageRating: recipe.averageRating || 0,
      reviewCount: recipe.reviewCount || 0,
      currentPage: page,
      totalPages: Math.ceil(reviews.length / limit),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Error fetching reviews" }, { status: 500 });
  }
}

// POST a new review
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const validation = validateReview(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const review = {
      _id: generateId(),
      username: body.username, 
      rating: body.rating,
      comment: body.comment?.trim() || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("recipes").updateOne(
      { _id: params.id },
      { $push: { reviews: review } }
    );

    if (result.matchedCount === 0) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    await updateRecipeRating(db, params.id);

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ error: "Error adding review" }, { status: 500 });
  }
}


// PUT to update an existing review
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const validation = validateReview(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const result = await db.collection("recipes").updateOne(
      {
        _id: params.id,
        "reviews._id": body.reviewId
      },
      {
        $set: {
          "reviews.$.rating": body.rating,
          "reviews.$.comment": body.comment?.trim() || "",
          "reviews.$.updatedAt": new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await updateRecipeRating(db, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Error updating review" }, { status: 500 });
  }
}

// DELETE a review
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const result = await db.collection("recipes").updateOne(
      { _id: params.id },
      { $pull: { reviews: { _id: reviewId } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await updateRecipeRating(db, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Error deleting review" }, { status: 500 });
  }
}