import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

interface DBConnectionStatus {
  isConnected: boolean;
  readyState: number;
  stateText: string;
}

const stateMap: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Connect to MongoDB instance with retry and event handling
 */
export async function connectDB(): Promise<typeof mongoose> {
  try {
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection successfully established.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error encountered:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected.');
    });

    const conn = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 5000,
    });

    return conn;
  } catch (error) {
    logger.error('Initial MongoDB connection failure:', error);
    // In production or development, let caller determine whether to exit or run in degraded mode
    throw error;
  }
}

/**
 * Gracefully disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection cleanly closed.');
  } catch (error) {
    logger.error('Error while disconnecting MongoDB:', error);
  }
}

/**
 * Get current database connection state
 */
export function getDBStatus(): DBConnectionStatus {
  const readyState = mongoose.connection.readyState;
  return {
    isConnected: readyState === 1,
    readyState,
    stateText: stateMap[readyState] || 'unknown',
  };
}
