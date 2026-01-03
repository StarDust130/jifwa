import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// 🟢 Database name: let the URI decide by default; only use env if valid
const RAW_DB_NAME = process.env.MONGODB_DB_NAME || process.env.DB_NAME || "";
const normalizeDbName = (name: string) => name.replace(/[^A-Za-z0-9_-]/g, "");
const normalized = normalizeDbName(RAW_DB_NAME);
const isValidDbName = (name: string) =>
  name.length > 0 && /^[A-Za-z0-9_-]+$/.test(name);
const DB_NAME = isValidDbName(normalized) ? normalized : "";

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
    const opts: Parameters<typeof mongoose.connect>[1] = {
      bufferCommands: false,
    };

    // Only set dbName if explicitly provided AND valid; otherwise let URI decide
    if (DB_NAME) {
      opts.dbName = DB_NAME;
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      if (DB_NAME) {
        console.log(`Connected to MongoDB Database: ${DB_NAME}`);
      } else {
        console.log(`Connected to MongoDB (db name from URI)`);
      }
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
