import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mark route as dynamic since it depends on session and headers
export const dynamic = "force-dynamic";

/**
 * GET handler for retrieving user profile
 * @returns {Promise<NextResponse>} JSON response with user profile or error
 */
export async function GET() {
  try {
    // Get server session with auth options
    const session = await getServerSession(authOptions);

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

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

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
 * PUT handler for updating user profile
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with update status
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const updates = await request.json();

    // Validate required fields
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    // Filter allowed fields to update
    const allowedUpdates = ["name", "image"];
    const sanitizedUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const client = await clientPromise;
    const db = client.db("devdb");

    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          ...sanitizedUpdates,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No changes were made to the profile" },
        { status: 200 }
      );
    }

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
