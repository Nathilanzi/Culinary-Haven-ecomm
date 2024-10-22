import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("devdb");

    console.log("Requested ID:", id); // Log the ID for debugging

    let query = { _id: id};

    console.log("Query:", query); // Log the query object for debugging

    const recipe = await db.collection("recipes").findOne(query);

    if (!recipe) {
      // Log the error for more debugging context
      console.error("Recipe not found with ID:", id);
      return NextResponse.json(
        { }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    return NextResponse.json( );
  }
}
