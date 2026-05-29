import mongoose from 'mongoose';
import { env } from './env';

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  const isAtlas = env.mongodbUri.startsWith('mongodb+srv://');

  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 15000,
    ...(isAtlas && {
      // Recommended for MongoDB Atlas
      retryWrites: true,
      w: 'majority',
    }),
  });

  const host = isAtlas ? 'MongoDB Atlas (cloud)' : mongoose.connection.host;
  console.log(`MongoDB connected: ${mongoose.connection.name} @ ${host}`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}
