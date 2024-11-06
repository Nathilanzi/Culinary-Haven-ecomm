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
  const db = client.db("devdb");
  const collection = db.collection("recipes");
  const errors = [];

  try {
    // Get existing indexes
    const existingIndexes = await collection.listIndexes().toArray();
    const indexNames = existingIndexes.map((index) => index.name);

    // Only attempt to drop if the index exists
    if (indexNames.includes("recipe_search_index")) {
      try {
        await collection.dropIndex("recipe_search_index");
        // Wait a short time to ensure the index drop is complete
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code !== 27) {
          // Skip if index doesn't exist
          errors.push(`Failed to drop index recipe_search_index: ${error.message}`);
        }
      }
    }

    // Create new indexes
    const indexOperations = [
      {
        operation: async () => {
          try {
            await collection.createIndex(
              { title: "text", description: "text", tags: "text" },
              {
                weights: { title: 10, description: 5, tags: 3 },
                name: "recipe_search_index",
                background: true,
              }
            );
          } catch (error) {
            if (error.code !== 85) {
              throw error;
            }
          }
        },
        name: "recipe_search_index",
      },
      {
        operation: () => collection.createIndex({ category: 1 }, { background: true }),
        name: "category_index",
      },
      {
        operation: () => collection.createIndex({ tags: 1 }, { background: true }),
        name: "tags_index",
      },
      {
        operation: () => collection.createIndex({ "ingredients.name": 1 }, { background: true }),
        name: "ingredients_index",
      },
      {
        operation: () => collection.createIndex({ instructions: 1 }, { background: true }),
        name: "instructions_index",
      },
      {
        operation: () => collection.createIndex({ category: 1, createdAt: -1 }, { background: true }),
        name: "category_date_index",
      },
      // New index operations
      {
        operation: () => collection.createIndex({ "reviews.rating": 1, "reviews.createdAt": -1 }, { background: true }),
        name: "Reviews compound index",
      },
      {
        operation: () => collection.createIndex({ "reviews.userId": 1 }, { background: true }),
        name: "Review user index",
      },
      {
        operation: () => collection.createIndex({ averageRating: -1 }, { background: true }),
        name: "Average rating index",
      },
    ];

    // Execute each index operation with retries
    for (const { operation, name } of indexOperations) {
      let retries = 3;
      while (retries > 0) {
        try {
          await operation();
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            if (error.code !== 85) {
              errors.push(`Failed to create index ${name}: ${error.message}`);
            }
          } else {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    }

    if (errors.length > 0) {
      // Log errors but don't throw
      console.error(`Index initialization completed with warnings: ${errors.join("; ")}`);
    }
  } catch (error) {
    // Log error but don't throw
    console.error(`Index initialization error: ${error.message}`);
  }
}

// Function to check and create reviews if not present
async function checkAndCreateReviews(client) {
  const db = client.db("devdb");
  const collection = db.collection("recipes");

  try {
    // Find all recipes without reviews
    const recipesWithoutReviews = await collection.find({ reviews: { $exists: false } }).toArray();
    
    // Update each recipe to add an empty reviews array if it does not exist
    if (recipesWithoutReviews.length > 0) {
      const updatePromises = recipesWithoutReviews.map(recipe => {
        return collection.updateOne(
          { _id: recipe._id },
          { $set: { reviews: [] } } // Create an empty array for reviews
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
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then(async (client) => {
        try {
          await initializeIndexes(client);
          await checkAndCreateReviews(client); // Call the new function here
        } catch (error) {
          console.error("Initialization failed:", error);
        }
        return client;
      })
      .catch((error) => {
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then(async (client) => {
      try {
        await initializeIndexes(client);
        await checkAndCreateReviews(client); // Call the new function here
      } catch (error) {
        console.error("Initialization failed:", error);
      }
      return client;
    })
    .catch((error) => {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    });
}

export default clientPromise;
