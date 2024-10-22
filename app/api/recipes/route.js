// Import required dependencies
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
    const page = parseInt(searchParams.get("page")) || 1;  // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 20; // Default to 20 items per page

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("devdb");

    // Calculate number of documents to skip
    const skip = (page - 1) * limit;

    // Execute queries in parallel for better performance
    const [recipes, total] = await Promise.all([
      // Query for paginated recipes
      db
        .collection("recipes")
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray(),
      // Query for total count of recipes
      db.collection("recipes").countDocuments(),
    ]);

    // Return successful response with recipes data
    return NextResponse.json({
      recipes,              // Array of recipe documents
      total,               // Total number of recipes
      totalPages: Math.ceil(total / limit), // Calculate total pages
    });
  } catch (error) {
    // Return error response if something goes wrong
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}