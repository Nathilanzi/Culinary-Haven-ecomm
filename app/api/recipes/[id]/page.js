import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Reusable function to fetch recipe
async function getRecipeById(id) {
  const client = await clientPromise;
  const db = client.db("devdb");

  try {
    console.log("Requested ID:", id); // Log the ID for debugging

    let query = { _id: id };

    console.log("Query:", query); // Log the query object for debugging

    const recipe = await db.collection("recipes").findOne(query);

    if (!recipe) {
      console.error("Recipe not found with ID:", id);
      return null;
    }

    return recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    return null;
  }
}

// Main handler for both GET and PUT requests
export async function handler(req, { params }) {
  const { id } = params;

  // If the request is GET, fetch the recipe
  if (req.method === "GET") {
    const recipe = await getRecipeById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json(recipe);
  }

  // If the request is PUT, update the recipe
  if (req.method === "PUT") {
    try {
      if (!id?.trim()) throw new Error("Recipe ID is required");

      // Log the recipe ID being changed
      console.log(`Updating recipe with ID: ${id}`);  // This is the added log

      // Assuming request.body is the body with description and user data
      const { description, lastEditedBy, lastEditedAt } = await req.json();

      const client = await clientPromise;
      const db = client.db("devdb");

      // Perform the update
      const updateResult = await db.collection("recipes").updateOne(
        { _id: id },
        {
          $set: {
            description,
            lastEditedBy,
            lastEditedAt,
          }
        }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error("Recipe not found or no changes made");
      }

      const updatedRecipe = await getRecipeById(id); // Fetch the updated recipe
      return NextResponse.json(updatedRecipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  // If method is not GET or PUT, return a 405 Method Not Allowed error
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
