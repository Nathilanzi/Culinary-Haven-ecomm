import { NextResponse } from "next/server"; 
import clientPromise from "@/lib/mongodb";

/**
 * Handles GET requests for recipes with pagination, tag filtering, and ingredient filtering
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with filtered recipes data or error
 */
export async function GET(request) {
  try {
    // Extract and parse URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search");
    const tags = searchParams.getAll("tags"); // Get all tags parameters
    const matchType = searchParams.get("matchType") || "all"; // 'all' or 'any', defaults to 'all'
    const ingredients = searchParams.getAll("ingredients"); // Get all ingredients parameters
// Sorting parameters
    const sortBy = searchParams.get("sortBy") || "creationDate"; // Default to 'creationDate'
    const order = searchParams.get("order") === "desc" ? -1 : 1; // Default to ascending order

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("devdb");

    // Build the query object
    let query = {};

    // Add search condition if present
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    // Initialize conditions array for $and operator
    const conditions = [];

    // Add tags filtering if tags are provided
    if (tags && tags.length > 0) {
      const tagsOperator = matchType === "all" ? "$all" : "$in";
      conditions.push({ tags: { [tagsOperator]: tags } });
    }

    // Add ingredients filtering if ingredients are provided
    if (ingredients && ingredients.length > 0) {
      const ingredientsOperator = matchType === "all" ? "$all" : "$in";
      conditions.push({ "ingredients.name": { [ingredientsOperator]: ingredients } });
    }

    // Combine conditions with existing query
    if (conditions.length > 0) {
      query = {
        ...query,
        $and: conditions
      };
    }

    // Calculate number of documents to skip
    const skip = (page - 1) * limit;

     // Build the sort object based on the requested sort field and order
     const sort = { [sortBy]: order };

    // Execute queries in parallel for better performance
    const [recipes, total] = await Promise.all([
      db.collection("recipes")
        .find(query)
        .sort(sort) // Apply sorting
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("recipes").countDocuments(query),
    ]);

    // Return successful response with recipes data
    return NextResponse.json({
      recipes,
      total,
      totalPages: Math.ceil(total / limit),
      appliedFilters: {
        tags,
        ingredients,
        matchType,
        search,
        sortBy,
        order: order === 1 ? "asc" : "desc"
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}