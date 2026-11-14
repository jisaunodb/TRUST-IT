import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { env } from './env.ts';

let usingMongo = false;
let activeDbName = 'local-json';

function resolveDatabaseName(uri: string): string {
  const configuredDb = process.env.MONGODB_DB_NAME?.trim();
  if (configuredDb) return configuredDb;
  try {
    const parsed = new URL(uri);
    const dbFromPath = parsed.pathname.replace(/^\/+/, '').trim();
    return dbFromPath || 'trust_it';
  } catch {
    return 'trust_it';
  }
}

export const isMongoConnected = () => usingMongo;
export const getActiveDatabaseName = () => activeDbName;

export async function connectDatabase(): Promise<void> {
  if (env.mongodbUri) {
    const dbName = resolveDatabaseName(env.mongodbUri);
    try {
      await mongoose.connect(env.mongodbUri, {
        dbName,
        serverSelectionTimeoutMS: 5000,
      });
      usingMongo = true;
      activeDbName = mongoose.connection.name || dbName;
      console.log(`[DB] Connected to MongoDB database "${activeDbName}" via Mongoose`);
      return;
    } catch (error) {
      console.warn('[DB] MongoDB connection failed, falling back to local persistent JSON store:', (error as Error).message);
    }
  } else {
    console.log('[DB] MONGODB_URI not provided; using persistent local store (/backend/data/store.json)');
  }

  activeDbName = 'local-json';

  usingMongo = false;
  const dataDir = path.resolve(process.cwd(), 'backend', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}
