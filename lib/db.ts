import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// 🟢 DETERMINE DATABASE NAME BASED ON ENVIRONMENT
const DB_NAME = process.env.NODE_ENV === "production" ? "prd" : "test";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache = (global as { mongoose?: MongooseCache })
  .mongoose as MongooseCache;

if (!cached) {
  (global as { mongoose?: MongooseCache }).mongoose = {
    conn: null,
    promise: null,
  };
  cached = (global as { mongoose?: MongooseCache }).mongoose as MongooseCache;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME, // 👈 Explicitly force the DB name here
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`Connected to MongoDB Database: ${DB_NAME}`); // Optional: Log to confirm
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
