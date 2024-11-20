import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');

    // Fetch allergen data from the 'allergens' collection
    const allergensDocument = await db.collection('allergens').findOne({});

    if (!allergensDocument || !allergensDocument.allergens) {
      return NextResponse.json({ error: 'Allergen data not found' }, { status: 404 });
    }

    return NextResponse.json({ allergens: allergensDocument.allergens });
  } catch (error) {
    console.error('Error fetching allergens:', error.message);
    return NextResponse.json({ error: 'Failed to fetch allergens' }, { status: 500 });
  }
}
