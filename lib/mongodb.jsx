import { MongoClient } from "mongodb";

// Check for required environment variable
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Get MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;
// Initialize options object for MongoDB client
const options = {};

// Declare variables for MongoDB client and its promise
let client;
let clientPromise;

// Handle different environments (development vs production)
if (process.env.NODE_ENV === "development") {
  // For development: Maintain a cached connection to prevent multiple connections
  if (!global._mongoClientPromise) {
    // If no cached connection exists, create a new client
    client = new MongoClient(uri, options);
    // Store the client promise globally
    global._mongoClientPromise = client.connect();
  }
  // Use the cached promise
  clientPromise = global._mongoClientPromise;
} else {
  // For production: Create a new client instance for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the client promise for use in other parts of the application
export default clientPromise;
