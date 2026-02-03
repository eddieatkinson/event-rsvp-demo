import { MongoClient } from "mongodb";

let db;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    db = client.db();

    await db
      .collection("events")
      .createIndex({ createdAt: -1 }, { name: "createdAt_desc" });
    console.log("MongoDB connected and index ensured");
  } catch (err) {
    console.error("Mongo connection error:", err);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}
