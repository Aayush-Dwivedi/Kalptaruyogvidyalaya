import { Router } from 'express';
import {
  listMediaAssets,
  uploadMedia,
  uploadMultipleMedia,
  deleteMedia,
  createSignedUrl,
} from '../controllers/media.controller';
import { uploadSingleMedia, uploadMultipleMedia as uploadMultipleFiles } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { deleteMediaSchema, createSignedUrlSchema } from '../validators/media.validator';

const router = Router();

// List uploaded media asset metadata
router.get('/', listMediaAssets);

// Upload single asset to Supabase Storage
router.post('/upload', uploadSingleMedia, uploadMedia);

// Upload multiple assets to Supabase Storage (up to 10 files)
router.post('/upload-multiple', uploadMultipleFiles, uploadMultipleMedia);

// Delete asset from Supabase Storage
router.delete('/', validate(deleteMediaSchema), deleteMedia);

// Generate time-limited signed URL for private asset
router.post('/signed-url', validate(createSignedUrlSchema), createSignedUrl);

export default router;
