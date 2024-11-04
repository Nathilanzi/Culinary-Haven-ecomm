import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Mark route as dynamic since it depends on request parameters
export const dynamic = "force-dynamic";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 10);

    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    // Ensure index exists
    await db.collection("recipes").createIndex({
      title: 1,
    });

    // Escape special regex characters
    const safeQuery = escapeRegExp(query);

    // Simple and efficient query approach
    const suggestions = await db
      .collection("recipes")
      .find(
        {
          title: {
            $regex: safeQuery,
            $options: "i",
          },
        },
        {
          projection: {
            _id: 1,
            title: 1,
            category: 1,
          },
        }
      )
      .sort({ title: 1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      suggestions: suggestions.map(({ _id, title, category }) => ({
        id: _id,
        title,
        category,
      })),
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
