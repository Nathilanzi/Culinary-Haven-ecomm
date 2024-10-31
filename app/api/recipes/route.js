import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * Handles GET requests for recipes with pagination, filtering, sorting, and category/tag filtering.
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with recipes data, total count, pagination details, and categories.
 */
export async function GET(request) {
  try {
    // Extract and parse URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "$natural";
    const order = searchParams.get("order") || "asc";
    const category = searchParams.get("category") || "";
    const tags = searchParams.getAll("tags[]");
    const tagMatchType = searchParams.get("tagMatchType") || "all";

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("devdb");

    // Build the query object
    const query = {};

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    if (category) {
      query.category = category;
    }

    // Tag filtering based on the match type
    if (tags.length > 0) {
      if (tagMatchType === "all") {
        query.tags = { $all: tags };
      } else {
        query.tags = { $in: tags };
      }
    }

    // Calculate number of documents to skip
    const skip = (page - 1) * limit;

    // Handle sorting
    let sortObject = { $natural: 1 };
    if (sortBy !== "$natural") {
      if (sortBy === "instructionCount") {
        // Add a pipeline stage to count instructions
        const pipeline = [
          { $match: query },
          {
            $addFields: {
              instructionCount: { $size: "$instructions" },
            },
          },
          { $sort: { instructionCount: order === "asc" ? 1 : -1 } },
          { $skip: skip },
          { $limit: limit },
        ];

        const recipes = await db
          .collection("recipes")
          .aggregate(pipeline)
          .toArray();
        const total = await db.collection("recipes").countDocuments(query);
        const categories = await db.collection("categories").find({}).toArray();

        return NextResponse.json({
          recipes,
          total,
          totalPages: Math.ceil(total / limit),
          categories,
        });
      } else {
        sortObject = { [sortBy]: order === "asc" ? 1 : -1 };
      }
    }

    // Fetch recipes, total count, and categories concurrently (for non-instruction count sorts)
    const [recipes, total, categories] = await Promise.all([
      db
        .collection("recipes")
        .find(query)
        .sort(sortObject)
        .skip(skip)
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
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Error fetching recipes" },
      { status: 500 }
    );
  }
}