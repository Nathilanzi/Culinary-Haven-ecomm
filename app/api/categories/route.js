import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    const categories = await db
      .collection("categories")
      .findOne({}, { projection: { categories: 1 } });

    return NextResponse.json(categories?.categories || []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}