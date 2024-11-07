// Endpoint to get recommended recipes sorted by average rating
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    // Fetch top 10 recipes by average rating
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
