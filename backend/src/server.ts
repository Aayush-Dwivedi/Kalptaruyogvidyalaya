import { createApp } from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/database';
import { logger } from './utils/logger';
import http from 'http';

async function startServer(): Promise<void> {
  const app = createApp();
  const server = http.createServer(app);

  // Attempt database connection
  try {
    await connectDB();
  } catch (error) {
    logger.error('Failed to establish initial MongoDB connection:', error);
    logger.warn('Server will continue running in degraded mode to allow health checks & diagnostics.');
  }

  server.listen(env.PORT, () => {
    logger.info(`=================================================`);
    logger.info(`  Kalptaru Yog Vidyalaya Backend Server Started  `);
    logger.info(` Port:        ${env.PORT}`);
    logger.info(` Environment: ${env.NODE_ENV}`);
    logger.info(` Health:      http://localhost:${env.PORT}/api/health`);
    logger.info(`=================================================`);
  });

  // Graceful Shutdown handlers
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Initiating graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });

    // Force shutdown after timeout if hanging
    setTimeout(() => {
      logger.error('Graceful shutdown timeout exceeded. Forcing exit.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection detected:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception occurred:', error);
    process.exit(1);
  });
}

startServer();
