import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Never hardcode production secrets; generate an ephemeral secret only when running locally without JWT_SECRET
const fallbackSecret = crypto.randomBytes(48).toString('hex');

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:3000',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || fallbackSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL || '',
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || '',
  adminSeedName: process.env.ADMIN_SEED_NAME || 'Tariqul Islam',
};

export const isCloudinaryConfigured = Boolean(
  env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret
);
