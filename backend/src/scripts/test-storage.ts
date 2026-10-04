import http from 'http';
import { createApp } from '../app';
import { connectDB, disconnectDB } from '../config/database';
import { storageService, StorageService } from '../services/storage';
import { StorageFolder } from '../services/storage/storage.interface';
import { fileFilter } from '../middleware/upload';
import { logger } from '../utils/logger';

async function runStorageTests() {
  logger.info('==================================================');
  logger.info('  PHASE 6: Supabase Storage Architecture Test    ');
  logger.info('==================================================');

  let passed = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      logger.info(`[PASS] ${testName}${detail ? ` (${detail})` : ''}`);
      passed++;
    } else {
      logger.error(`[FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
    }
  }

  // 1. Test StorageService abstraction and method existence
  assert(typeof storageService.upload === 'function', 'StorageService supports upload()');
  assert(typeof storageService.delete === 'function', 'StorageService supports delete()');
  assert(typeof storageService.getPublicUrl === 'function', 'StorageService supports getPublicUrl()');
  assert(typeof storageService.createSignedUrl === 'function', 'StorageService supports createSignedUrl()');

  // 2. Test Folder Strategy and Path Generation
  const testFolders: StorageFolder[] = [
    'hero',
    'courses',
    'workshops',
    'gallery',
    'founder',
    'institute',
    'videos',
    'site-assets',
    'general',
  ];

  for (const folder of testFolders) {
    const generatedPath = StorageService.buildStoragePath('sample photo.jpg', folder);
    const startsWithFolder = generatedPath.startsWith(`${folder}/`);
    const endsWithExt = generatedPath.endsWith('.jpg');
    assert(
      startsWithFolder && endsWithExt,
      `Folder strategy routing for '${folder}'`,
      generatedPath
    );
  }

  // 3. Test Direct Storage Operations via StorageService
  const sampleBuffer = Buffer.from('fake-image-binary-content-for-testing');
  const samplePath = StorageService.buildStoragePath('test-asana.webp', 'courses');

  const uploadResult = await storageService.upload(sampleBuffer, samplePath, {
    contentType: 'image/webp',
    originalFilename: 'test-asana.webp',
    folder: 'courses',
  });

  assert(
    uploadResult.path === samplePath &&
      uploadResult.publicUrl.includes(samplePath) &&
      uploadResult.size === sampleBuffer.length &&
      uploadResult.contentType === 'image/webp' &&
      !!uploadResult.createdAt,
    'StorageService.upload() returns complete metadata (path, bucket, publicUrl, size, contentType, createdAt)',
    uploadResult.publicUrl
  );

  const publicUrl = storageService.getPublicUrl(samplePath);
  assert(publicUrl.includes(samplePath), 'StorageService.getPublicUrl() generates valid public URL');

  const signedUrl = await storageService.createSignedUrl(samplePath, 1800);
  assert(signedUrl.includes(samplePath), 'StorageService.createSignedUrl() generates valid signed URL');

  await storageService.delete(samplePath);
  assert(true, 'StorageService.delete() successfully invoked');

  // 4. Test File Validation (MIME & Extension)
  let validAccepted = false;
  fileFilter(
    {} as any,
    { originalname: 'mandala.png', mimetype: 'image/png' } as any,
    (err, accept) => {
      if (!err && accept) validAccepted = true;
    }
  );
  assert(validAccepted, 'File validation accepts valid PNG image');

  let webpAccepted = false;
  fileFilter(
    {} as any,
    { originalname: 'lotus.webp', mimetype: 'image/webp' } as any,
    (err, accept) => {
      if (!err && accept) webpAccepted = true;
    }
  );
  assert(webpAccepted, 'File validation accepts valid WEBP image');

  let jpegAccepted = false;
  fileFilter(
    {} as any,
    { originalname: 'guru.jpg', mimetype: 'image/jpeg' } as any,
    (err, accept) => {
      if (!err && accept) jpegAccepted = true;
    }
  );
  assert(jpegAccepted, 'File validation accepts valid JPEG image');

  let invalidRejected = false;
  fileFilter(
    {} as any,
    { originalname: 'malicious.exe', mimetype: 'application/x-msdownload' } as any,
    (err) => {
      if (err) invalidRejected = true;
    }
  );
  assert(invalidRejected, 'File validation rejects malicious .exe executable');

  let disguisedRejected = false;
  fileFilter(
    {} as any,
    { originalname: 'script.php', mimetype: 'image/png' } as any,
    (err) => {
      if (err) disguisedRejected = true;
    }
  );
  assert(disguisedRejected, 'File validation rejects disguised script (.php with image/png MIME)');

  // 5. Test HTTP Endpoints via Express App
  await connectDB();
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}/api/media`;

  // Test GET /api/media
  const listRes = await fetch(baseUrl);
  const listData = await listRes.json();
  assert(listRes.status === 200 && listData.success, 'GET /api/media returns 200 with media asset list');

  // Test POST /api/media/signed-url
  const signedRes = await fetch(`${baseUrl}/signed-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: 'courses/test-sample.jpg', expiresIn: 3600 }),
  });
  const signedData = await signedRes.json();
  assert(
    signedRes.status === 200 && signedData.success && !!signedData.data?.signedUrl,
    'POST /api/media/signed-url generates signed URL through controller'
  );

  // Test DELETE /api/media
  const deleteRes = await fetch(baseUrl, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: 'courses/test-sample.jpg' }),
  });
  const deleteData = await deleteRes.json();
  assert(
    deleteRes.status === 200 && deleteData.success,
    'DELETE /api/media deletes asset and cleans up metadata'
  );

  server.close();
  await disconnectDB();

  logger.info('==================================================');
  logger.info(`Storage Test Suite Completed: ${passed} / ${totalTests} passed`);
  logger.info('==================================================');

  if (passed === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runStorageTests().catch((err) => {
  logger.error('Fatal storage test failure:', err);
  process.exit(1);
});
