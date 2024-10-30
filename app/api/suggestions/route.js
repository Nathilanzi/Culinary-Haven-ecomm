import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    // Create text index for title field if it doesn't exist
    await db.collection("recipes").createIndex({ title: "text" });

    // Query using $text search for exact matches and partial matches
    const suggestions = await db
      .collection("recipes")
      .aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: query, $options: "i" } }, // Case-insensitive partial match
              { $text: { $search: query } }, // Text index search for exact matches
            ],
          },
        },
        {
          $project: {
            title: 1,
            score: { $meta: "textScore" },
          },
        },
        { $sort: { score: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    return NextResponse.json({
      suggestions: suggestions.map((s) => ({ id: s._id, title: s.title })),
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Error fetching suggestions" },
      { status: 500 }
    );
  }
}
