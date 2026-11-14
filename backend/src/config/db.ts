import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { env } from './env.ts';

let usingMongo = false;

export const isMongoConnected = () => usingMongo;

export async function connectDatabase(): Promise<void> {
  if (env.mongodbUri) {
    try {
      await mongoose.connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 5000,
      });
      usingMongo = true;
      console.log('[DB] Connected to MongoDB via Mongoose');
      return;
    } catch (error) {
      console.warn('[DB] MongoDB connection failed, falling back to local persistent JSON store:', (error as Error).message);
    }
  } else {
    console.log('[DB] MONGODB_URI not provided; using persistent local store (/backend/data/store.json)');
  }

  usingMongo = false;
  const dataDir = path.resolve(process.cwd(), 'backend', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}
