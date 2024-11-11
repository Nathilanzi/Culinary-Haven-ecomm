import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("devdb");

    const recipe = await db.collection("recipes").findOne({ _id: id });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { description, userName } = await request.json();

    // Validate description
    if (
      !description ||
      typeof description !== "string" ||
      description.length < 10
    ) {
      return NextResponse.json(
        { error: "Invalid description. Must be at least 10 characters long." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const now = new Date();

    // Update recipe with new description and version history
    const updateResult = await db.collection("recipes").updateOne(
      { _id: id },
      {
        $set: {
          description: description,
          [`userVersions.${now.getTime()}`]: {
            userName: userName,
            description: description,
            lastModified: now,
          },
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Fetch and return the updated recipe
    const updatedRecipe = await db.collection("recipes").findOne({ _id: id });

    return NextResponse.json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
