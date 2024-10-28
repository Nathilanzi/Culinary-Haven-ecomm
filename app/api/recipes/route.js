import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * Handles GET requests for recipes with pagination and tag filtering
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with filtered recipes data or error
 */
export async function GET(request) {
  try {
    // Extract and parse URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 20; // Default to 20 items per page
    const search = searchParams.get("search");
    const tags = searchParams.getAll("tags"); // Get all tags parameters
    const matchType = searchParams.get("matchType") || "all"; // 'all' or 'any', defaults to 'all'

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("devdb");

    // Build the query object
    let query = {};

    // Add search condition if present
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    // Add tags filtering if tags are provided
    if (tags && tags.length > 0) {
      // If matchType is 'all', use $all operator to match all tags
      // If matchType is 'any', use $in operator to match any tag
      const tagsOperator = matchType === "all" ? "$all" : "$in";
      
      // Merge with existing query
      query = {
        ...query,
        tags: { [tagsOperator]: tags }
      };
    }

    // Calculate number of documents to skip
    const skip = (page - 1) * limit;

    // Execute queries in parallel for better performance
    const [recipes, total] = await Promise.all([
      // Query for paginated and filtered recipes
      db.collection("recipes")
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray(),
      // Query for total count of filtered recipes
      db.collection("recipes").countDocuments(query),
    ]);

    // Return successful response with recipes data
    return NextResponse.json({
      recipes, // Array of recipe documents
      total, // Total number of filtered recipes
      totalPages: Math.ceil(total / limit), // Calculate total pages
      appliedFilters: {
        tags,
        matchType,
        search,
      },
    });
  } catch (error) {
    // Return error response if something goes wrong
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}