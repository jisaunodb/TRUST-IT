import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { env, isCloudinaryConfigured } from '../config/env.ts';
import { MediaAsset } from '../types/entities.ts';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
}

const UPLOAD_ROOT = path.resolve(process.cwd(), 'public', 'uploads');

export type CloudinaryFolder =
  | 'trust-it'
  | 'trust-it/projects'
  | 'trust-it/team'
  | 'trust-it/blog'
  | 'trust-it/services'
  | 'trust-it/services/web-development'
  | 'trust-it/services/digital-marketing'
  | 'trust-it/services/seo'
  | 'trust-it/services/design'
  | 'trust-it/careers'
  | 'trust-it/settings';

export function getOptimizedUrl(publicId: string, secureUrl: string): string {
  if (isCloudinaryConfigured && publicId && !publicId.startsWith('local/')) {
    return cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true,
    });
  }
  return secureUrl;
}

export async function uploadAsset(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  folder: CloudinaryFolder,
  alt = ''
): Promise<MediaAsset> {
  const safeAlt = alt || path.parse(originalName).name.replace(/[-_]+/g, ' ');

  if (isCloudinaryConfigured) {
    const resourceType = mimetype === 'application/pdf' || mimetype.includes('word') ? 'raw' : 'image';
    const result = await new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation: resourceType === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : undefined,
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({ public_id: uploaded.public_id, secure_url: uploaded.secure_url });
        }
      );
      stream.end(buffer);
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      alt: safeAlt,
    };
  }

  const relativeDir = folder.replace(/\//g, path.sep);
  const targetDir = path.join(UPLOAD_ROOT, relativeDir);
  fs.mkdirSync(targetDir, { recursive: true });

  const ext = path.extname(originalName) || '.bin';
  const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
  const fullPath = path.join(targetDir, uniqueName);
  fs.writeFileSync(fullPath, buffer);

  const publicId = `local/${folder}/${uniqueName}`;
  const secureUrl = `/uploads/${folder}/${uniqueName}`;
  return {
    public_id: publicId,
    secure_url: secureUrl,
    alt: safeAlt,
  };
}

export async function deleteAsset(publicId: string): Promise<void> {
  if (!publicId) return;

  if (isCloudinaryConfigured && !publicId.startsWith('local/')) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch {
      // Ignore cleanup errors for missing remote assets
    }
    return;
  }

  if (publicId.startsWith('local/')) {
    const relative = publicId.replace(/^local\//, '');
    const filePath = path.join(UPLOAD_ROOT, relative);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export async function replaceAsset(
  oldPublicId: string | undefined,
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  folder: CloudinaryFolder,
  alt = ''
): Promise<MediaAsset> {
  const uploaded = await uploadAsset(buffer, originalName, mimetype, folder, alt);
  if (oldPublicId && oldPublicId !== uploaded.public_id) {
    await deleteAsset(oldPublicId);
  }
  return uploaded;
}
