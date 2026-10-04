import http from 'http';
import { createApp } from '../app';
import { connectDB, disconnectDB } from '../config/database';
import { logger } from '../utils/logger';

async function testEndpoints() {
  await connectDB();
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}/api`;
  logger.info(`Test server listening on ${baseUrl}`);

  const endpointsToTest = [
    { method: 'GET', path: '/' },
    { method: 'GET', path: '/health' },
    { method: 'GET', path: '/home' },
    { method: 'GET', path: '/institute' },
    { method: 'GET', path: '/founders' },
    { method: 'GET', path: '/hero-slides' },
    { method: 'GET', path: '/programs' },
    { method: 'GET', path: '/courses' },
    { method: 'GET', path: '/workshops' },
    { method: 'GET', path: '/corporate-programs' },
    { method: 'GET', path: '/membership-plans' },
    { method: 'GET', path: '/gallery' },
    { method: 'GET', path: '/gallery/categories' },
    { method: 'GET', path: '/videos' },
    { method: 'GET', path: '/benefits' },
  ];

  let passed = 0;
  for (const ep of endpointsToTest) {
    try {
      const res = await fetch(`${baseUrl}${ep.path}`);
      const data = await res.json();
      if (res.status === 200 && data.success) {
        logger.info(`[PASS] ${ep.method} ${ep.path} -> HTTP ${res.status}`);
        passed++;
      } else {
        logger.error(`[FAIL] ${ep.method} ${ep.path} -> HTTP ${res.status}:`, data);
      }
    } catch (err) {
      logger.error(`[ERROR] ${ep.method} ${ep.path}:`, err);
    }
  }

  // Also test slug queries
  try {
    const courseRes = await fetch(`${baseUrl}/courses/200-hour-yoga-teacher-training`);
    const courseData = await courseRes.json();
    if (courseRes.status === 200 && courseData.data?.title) {
      logger.info(`[PASS] GET /courses/:slug -> Found '${courseData.data.title}'`);
      passed++;
    } else {
      logger.error(`[FAIL] GET /courses/:slug -> HTTP ${courseRes.status}`);
    }
  } catch (err) {
    logger.error(`[ERROR] GET /courses/:slug:`, err);
  }

  // Also test validation error handling
  try {
    const invalidPost = await fetch(`${baseUrl}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'X' }), // missing required fields
    });
    const errorData = await invalidPost.json();
    if (invalidPost.status === 400 && !errorData.success && Array.isArray(errorData.errors)) {
      logger.info(`[PASS] POST /courses validation error properly caught -> 400 with formatted errors`);
      passed++;
    } else {
      logger.error(`[FAIL] Validation did not return 400:`, errorData);
    }
  } catch (err) {
    logger.error(`[ERROR] Validation test:`, err);
  }

  logger.info(`Completed tests. Total passed: ${passed} / ${endpointsToTest.length + 2}`);

  server.close();
  await disconnectDB();
  process.exit(0);
}

testEndpoints();
