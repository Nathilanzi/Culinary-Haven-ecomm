import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export async function PUT(request, { params }) {
  const { id } = params;

 
  const session = await getSession({ req: request });
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const userId = session.user.id; 
  try {
    const { description } = await request.json();

   
    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }


    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    // Prepare the update document
    const updateData = {
      description: description.trim(),
      lastEditedBy: userId,
      lastEditedAt: new Date().toISOString(),
    };

    const result = await db.collection("recipes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Recipe updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}
