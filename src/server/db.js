import mongoose from 'mongoose';

const globalCache = globalThis;

if (!globalCache.__mongooseCache) {
  globalCache.__mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (globalCache.__mongooseCache.conn) {
    return globalCache.__mongooseCache.conn;
  }

  if (!globalCache.__mongooseCache.promise) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    globalCache.__mongooseCache.promise = mongoose
      .connect(mongoUri)
      .then((mongooseInstance) => mongooseInstance);
  }

  globalCache.__mongooseCache.conn = await globalCache.__mongooseCache.promise;
  return globalCache.__mongooseCache.conn;
}
