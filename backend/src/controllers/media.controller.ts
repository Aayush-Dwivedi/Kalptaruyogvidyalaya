import { Request, Response } from 'express';
import { storageService, StorageService } from '../services/storage';
import { StorageFolder } from '../services/storage/storage.interface';
import { MediaAsset } from '../models/MediaAsset';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../utils/appError';
import { asyncHandler } from '../utils/asyncHandler';

const VALID_FOLDERS = new Set<StorageFolder>([
  'hero',
  'courses',
  'workshops',
  'gallery',
  'founder',
  'institute',
  'videos',
  'site-assets',
  'general',
]);

function resolveFolder(rawFolder?: string): StorageFolder {
  if (rawFolder && VALID_FOLDERS.has(rawFolder.toLowerCase() as StorageFolder)) {
    return rawFolder.toLowerCase() as StorageFolder;
  }
  return 'general';
}

/**
 * Upload a single media file to Supabase Storage and store metadata in MongoDB
 */
export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw AppError.badRequest('No file uploaded. Please attach a file with field name "file".');
  }

  const folder = resolveFolder(req.body.folder);
  const storagePath = StorageService.buildStoragePath(req.file.originalname, folder);

  // Upload to Supabase Storage via abstraction
  const result = await storageService.upload(req.file.buffer, storagePath, {
    contentType: req.file.mimetype,
    originalFilename: req.file.originalname,
    folder,
    upsert: true,
  });

  // Store metadata reference in MongoDB (never binary data)
  const mediaAsset = await MediaAsset.create({
    path: result.path,
    bucket: result.bucket,
    originalFilename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    publicUrl: result.publicUrl,
    folder,
    alt: req.body.alt || req.file.originalname,
  });

  return ApiResponse.created(
    res,
    {
      path: mediaAsset.path,
      bucket: mediaAsset.bucket,
      originalFilename: mediaAsset.originalFilename,
      mimeType: mediaAsset.mimeType,
      size: mediaAsset.size,
      publicUrl: mediaAsset.publicUrl,
      folder: mediaAsset.folder,
      alt: mediaAsset.alt,
      createdAt: mediaAsset.createdAt,
    },
    'Media asset uploaded successfully to Supabase Storage'
  );
});

/**
 * Upload multiple media files to Supabase Storage and record metadata
 */
export const uploadMultipleMedia = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    throw AppError.badRequest('No files uploaded. Please attach files with field name "files".');
  }

  const folder = resolveFolder(req.body.folder);

  const uploadPromises = files.map(async (file) => {
    const storagePath = StorageService.buildStoragePath(file.originalname, folder);
    const result = await storageService.upload(file.buffer, storagePath, {
      contentType: file.mimetype,
      originalFilename: file.originalname,
      folder,
      upsert: true,
    });

    const asset = await MediaAsset.create({
      path: result.path,
      bucket: result.bucket,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      publicUrl: result.publicUrl,
      folder,
      alt: file.originalname,
    });

    return {
      path: asset.path,
      bucket: asset.bucket,
      originalFilename: asset.originalFilename,
      mimeType: asset.mimeType,
      size: asset.size,
      publicUrl: asset.publicUrl,
      folder: asset.folder,
      alt: asset.alt,
      createdAt: asset.createdAt,
    };
  });

  const results = await Promise.all(uploadPromises);

  return ApiResponse.created(
    res,
    results,
    `Successfully uploaded ${results.length} media assets to Supabase Storage`
  );
});

/**
 * Delete a media file from Supabase Storage and delete metadata from MongoDB
 */
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { path: storagePath } = req.body;
  if (!storagePath) {
    throw AppError.badRequest('Storage path is required for deletion');
  }

  // Delete from Supabase Storage via abstraction
  await storageService.delete(storagePath);

  // Remove metadata reference from MongoDB
  await MediaAsset.findOneAndDelete({ path: storagePath });

  return ApiResponse.success(
    res,
    null,
    `Asset '${storagePath}' deleted successfully from Supabase Storage`
  );
});

/**
 * Generate a time-limited signed URL for private or protected assets
 */
export const createSignedUrl = asyncHandler(async (req: Request, res: Response) => {
  const { path: storagePath, expiresIn = 3600 } = req.body;
  if (!storagePath) {
    throw AppError.badRequest('Storage path is required to generate a signed URL');
  }

  const signedUrl = await storageService.createSignedUrl(storagePath, expiresIn);

  return ApiResponse.success(
    res,
    { signedUrl, path: storagePath, expiresIn },
    'Signed URL generated successfully from Supabase Storage'
  );
});

/**
 * List media assets metadata stored in MongoDB
 */
export const listMediaAssets = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (req.query.folder) {
    filter.folder = req.query.folder;
  }

  const [items, total] = await Promise.all([
    MediaAsset.find(filter).sort('-createdAt').skip(skip).limit(limit),
    MediaAsset.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return ApiResponse.success(res, items, 'Media assets retrieved successfully', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  });
});
