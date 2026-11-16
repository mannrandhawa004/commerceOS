import { Redis } from "ioredis";
import { env } from "../../config/env.js";

export const redis = new Redis({
    host : env.REDIS_HOST,
    port : env.REDIS_PORT,
    password : env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest : 3,
    lazyConnect : true
})

export async function connectRedis(): Promise<void> {
  await redis.connect();
  console.log("Redis connected successfully");
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}