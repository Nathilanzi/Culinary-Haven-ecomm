import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Common allergens list
const commonAllergens = ['milk', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soy'];

export async function GET(req) {
  try {
    // Extract recipe ID from the request URL
    const recipeId = req.nextUrl.searchParams.get('recipeId');
    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db('your_database_name'); // Replace with your database name
    const collection = db.collection('your_collection_name'); // Replace with your collection name

    // Fetch the recipe document by ID
    const recipe = await collection.findOne({ _id: recipeId });
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Ensure `ingredients` field exists and is an array
    const ingredients = recipe.ingredients || [];
    if (!Array.isArray(ingredients)) {
      return NextResponse.json({ error: 'Invalid ingredients format' }, { status: 500 });
    }

    // Identify allergens present in the ingredients
    const foundAllergens = commonAllergens.filter(allergen =>
      ingredients.some(ingredient => ingredient.toLowerCase().includes(allergen))
    );

    // Return the response with the found allergens
    return NextResponse.json({ allergens: foundAllergens });
  } catch (error) {
    console.error('Error fetching allergens:', error);
    return NextResponse.json({ error: 'Failed to fetch allergens' }, { status: 500 });
  }
}
