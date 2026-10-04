import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { AppError } from '../utils/appError';

// Allowed MIME types and extensions for Kalptaru media assets
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/avif',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.svg',
  '.avif',
]);

/**
 * File validation checking both MIME type and file extension
 */
export const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  // Validate extension
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    callback(
      AppError.badRequest(
        `Invalid file extension '${ext}'. Supported image formats: JPEG (.jpg, .jpeg), PNG (.png), and WEBP (.webp).`
      )
    );
    return;
  }

  // Validate Content-Type / MIME type
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    callback(
      AppError.badRequest(
        `Invalid content type '${file.mimetype}'. Supported image formats: image/jpeg, image/png, and image/webp.`
      )
    );
    return;
  }

  callback(null, true);
};

// Memory storage keeps buffer in memory for direct stream to Supabase Storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size limit
  },
});

export const uploadSingleMedia = upload.single('file');
export const uploadMultipleMedia = upload.array('files', 10);
