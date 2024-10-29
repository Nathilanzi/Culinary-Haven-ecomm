import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * Handles GET requests for recipes with pagination
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with recipes data or error
 */
export async function GET(request) {
  try {
    // Extract and parse pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "title";
    const order = searchParams.get("order") || "asc";

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("devdb");

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        // { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    // Calculate number of documents to skip
    const skip = (page - 1) * limit;
    const sortObject = { [sortBy]: order === "asc" ? 1 : -1};

    const [recipes, total, categories] = await Promise.all([
      db
        .collection("recipes")
        .find(query)
        .skip(skip)
        .sort(sortObject)
        .limit(limit)
        .toArray(),
      db.collection("recipes").countDocuments(query),
      db.collection("categories").find({}).toArray(),
    ]);

    return NextResponse.json({
      recipes,
      total,
      totalPages: Math.ceil(total / limit),
      categories,
    });
  } catch (error) {
    // Return error response if something goes wrong
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
