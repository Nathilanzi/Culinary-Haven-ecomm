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

// Initialize indexes
async function initializeIndexes(client) {
  try {
    const db = client.db("devdb");
    const collection = db.collection("recipes");

    // Get existing indexes
    const existingIndexes = await collection.listIndexes().toArray();

    // Drop existing text indexes
    for (const index of existingIndexes) {
      if (index.key._fts) {
        await collection.dropIndex(index.name);
        console.log(`Dropped existing text index: ${index.name}`);
      }
    }

    // Create new indexes in sequence
    const indexOperations = [
      // Create the new compound text index
      {
        operation: () =>
          collection.createIndex(
            {
              title: "text",
              description: "text",
              tags: "text",
            },
            {
              weights: {
                title: 10,
                description: 5,
                tags: 3,
              },
              name: "recipe_search_index",
            }
          ),
        name: "Text search index",
      },
      // Regular indexes
      {
        operation: () => collection.createIndex({ category: 1 }),
        name: "Category index",
      },
      {
        operation: () => collection.createIndex({ tags: 1 }),
        name: "Tags index",
      },
      {
        operation: () => collection.createIndex({ "ingredients.name": 1 }),
        name: "Ingredients index",
      },
      {
        operation: () => collection.createIndex({ instructions: 1 }),
        name: "Instructions index",
      },
      {
        operation: () =>
          collection.createIndex({
            category: 1,
            createdAt: -1,
          }),
        name: "Category-date compound index",
      },
    ];

    // Execute each index operation sequentially
    for (const { operation, name } of indexOperations) {
      try {
        await operation();
        console.log(`Created ${name} successfully`);
      } catch (error) {
        // Log error but continue with other indexes
        console.error(`Error creating ${name}:`, error);
        if (!error.code || error.code !== 85) {
          // Only throw if it's not an index conflict
          throw error;
        }
      }
    }

    console.log("All index operations completed");
  } catch (error) {
    console.error("Error in index initialization:", error);
    // Don't throw the error - allow the application to continue even if some indexes fail
  }
}

if (process.env.NODE_ENV === "development") {
  // For development: Maintain a cached connection to prevent multiple connections
  if (!global._mongoClientPromise) {
    // If no cached connection exists, create a new client
    client = new MongoClient(uri, options);
    // Store the client promise globally
    global._mongoClientPromise = client.connect().then(async (client) => {
      await initializeIndexes(client);
      return client;
    });
  }
  // Use the cached promise
  clientPromise = global._mongoClientPromise;
} else {
  // For production: Create a new client instance for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then(async (client) => {
    await initializeIndexes(client);
    return client;
  });
}

// Export the client promise for use in other parts of the application
export default clientPromise;
