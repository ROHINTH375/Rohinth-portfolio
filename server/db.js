import mongoose from 'mongoose';

// Reuse one connection across serverless invocations (Vercel) and local restarts.
let cached = globalThis.__mongoose;
if (!cached) cached = globalThis.__mongoose = { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { dbName: process.env.MONGODB_DB || 'portfolio', serverSelectionTimeoutMS: 8000 })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null; // allow a retry on the next request
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
