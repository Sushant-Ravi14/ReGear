import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
  provider: 'cloudinary' | 'local';
}

/**
 * Upload an image buffer or base64 data to Cloudinary,
 * with a documented local filesystem fallback for development.
 */
export async function uploadImage(
  buffer: Buffer,
  originalName: string = 'upload.jpg',
  mimeType: string = 'image/jpeg'
): Promise<UploadResult> {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'regear_listings',
          resource_type: 'image',
          allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            return reject(error || new Error('Upload result undefined'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            provider: 'cloudinary',
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Development Fallback: Store locally in public/uploads/
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalName) || '.jpg';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  fs.writeFileSync(filePath, buffer);

  console.info(`[Dev Fallback] Saved image locally to /uploads/${uniqueName}. Note: Cloudinary credentials not detected.`);

  return {
    url: `/uploads/${uniqueName}`,
    publicId: uniqueName,
    provider: 'local',
  };
}

export { isCloudinaryConfigured };
