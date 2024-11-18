/**
 * Retrieves the user's profile from the database and returns it as a JSON response.
 *
 * This route is marked as dynamic since it depends on the user's session and headers.
 *
 * @returns {Promise<NextResponse>} - A JSON response with the user's profile or an error message.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get the user's session using the authOptions
    const session = await getServerSession(authOptions);

    // If there is no session, return a 401 Unauthorized response
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    const user = await db
      .collection("users")
      .findOne(
        { email: session.user.email },
        { projection: { password: 0, _id: 0 } }
      );

    // If the user's profile is not found, return a 404 Not Found response
    if (!user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Return the user's profile as a JSON response
    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile retrieval error:", error);
    return NextResponse.json(
      { error: "Internal server error while retrieving profile" },
      { status: 500 }
    );
  }
}

/**
 * Updates the user's profile in the database.
 *
 * This route is marked as dynamic since it depends on the user's session and headers.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - A JSON response with the update status.
 */
export async function PUT(request) {
  try {
    // Get the user's session using the authOptions
    const session = await getServerSession(authOptions);

    // If there is no session, return a 401 Unauthorized response
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the updates from the request body
    const updates = await request.json();

    // Validate that update data is provided
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    // Filter the allowed fields to update
    const allowedUpdates = ["name", "image"];
    const sanitizedUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // Connect to the MongoDB database
    const client = await clientPromise;
    const db = client.db("devdb");

    // Update the user's profile in the "users" collection
    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          ...sanitizedUpdates,
          updatedAt: new Date(),
        },
      }
    );

    // If the user's profile is not found, return a 404 Not Found response
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // If no changes were made, return a 200 OK response with a message
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No changes were made to the profile" },
        { status: 200 }
      );
    }

    // Return a 200 OK response with a success message
    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error while updating profile" },
      { status: 500 }
    );
  }
}
