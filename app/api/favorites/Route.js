import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Mark route as dynamic since it depends on request parameters
export const dynamic = "force-dynamic";

// Helper function to ensure the favorites collection exists
async function ensureFavoritesCollection(db) {
  const collections = await db.listCollections({ name: "favorites" }).toArray();
  if (collections.length === 0) {
    await db.createCollection("favorites");
  }
}
