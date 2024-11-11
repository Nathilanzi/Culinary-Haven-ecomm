import { MongoClient } from "mongodb";

// Check for required environment variable
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Get MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
};

// Declare variables for MongoDB client and its promise
let client;
let clientPromise;

// Initialize all necessary indexes
async function initializeIndexes(client) {
  const db = client.db("devdb");
  const errors = [];

  try {
    // Initialize indexes for recipes collection
    await initializeRecipeIndexes(db);

    // Initialize indexes for favorites collection
    await initializeFavoritesCollection(db);

    if (errors.length > 0) {
      console.error(`Index initialization completed with warnings: ${errors.join("; ")}`);
    }
  } catch (error) {
    console.error(`Index initialization error: ${error.message}`);
  }
}

// Initialize indexes for recipes collection
async function initializeRecipeIndexes(db) {
  const collection = db.collection("recipes");

  const indexOperations = [
    {
      operation: async () => {
        await collection.createIndex(
          { title: "text", description: "text", tags: "text" },
          {
            weights: { title: 10, description: 5, tags: 3 },
            name: "recipe_search_index",
            background: true,
          }
        );
      },
      name: "recipe_search_index",
    },
    { operation: () => collection.createIndex({ category: 1 }, { background: true }), name: "category_index" },
    { operation: () => collection.createIndex({ tags: 1 }, { background: true }), name: "tags_index" },
    { operation: () => collection.createIndex({ "ingredients.name": 1 }, { background: true }), name: "ingredients_index" },
    { operation: () => collection.createIndex({ instructions: 1 }, { background: true }), name: "instructions_index" },
    { operation: () => collection.createIndex({ category: 1, createdAt: -1 }, { background: true }), name: "category_date_index" },
    { operation: () => collection.createIndex({ "reviews.rating": 1, "reviews.createdAt": -1 }, { background: true }), name: "reviews_compound_index" },
    { operation: () => collection.createIndex({ "reviews.userId": 1 }, { background: true }), name: "review_user_index" },
    { operation: () => collection.createIndex({ averageRating: -1 }, { background: true }), name: "average_rating_index" },
  ];

  for (const { operation, name } of indexOperations) {
    try {
      await operation();
    } catch (error) {
      if (error.code !== 85) {
        console.error(`Failed to create index ${name}: ${error.message}`);
      }
    }
  }
}

// Initialize favorites collection and indexes
async function initializeFavoritesCollection(db) {
  try {
    const collections = await db.listCollections({ name: "favorites" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("favorites");
    }

    const favoritesCollection = db.collection("favorites");
    await favoritesCollection.createIndex({ userId: 1, recipeId: 1 }, { unique: true });
    await favoritesCollection.createIndex({ userId: 1, createdAt: -1 });

    await favoritesCollection.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: new Date() } }
    );
  } catch (error) {
    console.error("Error initializing favorites collection:", error);
  }
}

// Add reviews field to recipes if it does not exist
async function checkAndCreateReviews(db) {
  const collection = db.collection("recipes");

  try {
    const recipesWithoutReviews = await collection.find({ reviews: { $exists: false } }).toArray();

    if (recipesWithoutReviews.length > 0) {
      const updatePromises = recipesWithoutReviews.map(recipe => {
        return collection.updateOne(
          { _id: recipe._id },
          { $set: { reviews: [] } }
        );
      });
      await Promise.all(updatePromises);
      console.log(`${updatePromises.length} recipes updated with empty reviews array.`);
    } else {
      console.log("No recipes without reviews found.");
    }
  } catch (error) {
    console.error(`Error checking and creating reviews: ${error.message}`);
  }
}

// Main connection logic
async function initializeConnection() {
  try {
    client = new MongoClient(uri, options);
    const connectedClient = await client.connect();
    await initializeIndexes(connectedClient);
    await checkAndCreateReviews(connectedClient.db("devdb"));
    return connectedClient;
  } catch (error) {
    console.error("Failed to initialize MongoDB connection:", error);
    throw error;
  }
}

// Handle development and production environment connections
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = initializeConnection();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = initializeConnection();
}

export default clientPromise;

// Utility functions for favorites management
export async function getFavorites(userId) {
  const client = await clientPromise;
  const db = client.db("devdb");

  return db.collection("favorites")
    .aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "recipes",
          localField: "recipeId",
          foreignField: "_id",
          as: "recipe"
        }
      },
      { $unwind: "$recipe" },
      { $project: { _id: 1, userId: 1, recipeId: 1, createdAt: 1, recipe: 1 } },
      { $sort: { createdAt: -1 } }
    ])
    .toArray();
}

export async function addFavorite(userId, recipeId) {
  const client = await clientPromise;
  const db = client.db("devdb");

  try {
    await db.collection("favorites").insertOne({ userId, recipeId, createdAt: new Date() });
    return true;
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return false;
    }
    throw error;
  }
}

export async function removeFavorite(userId, recipeId) {
  const client = await clientPromise;
  const db = client.db("devdb");

  const result = await db.collection("favorites").deleteOne({ userId, recipeId });
  return result.deletedCount > 0;
}

export async function getFavoritesCount(userId) {
  const client = await clientPromise;
  const db = client.db("devdb");

  return db.collection("favorites").countDocuments({ userId });
}
