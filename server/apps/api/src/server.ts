import app from "./app.js";

import { env } from "./config/env.js";
import { logger } from "./config/app.config.js";

import {
  connectDatabase,
  disconnectDatabase
} from "./infrastructure/database/mongoose.js";

import {
  connectRedis,
  disconnectRedis
} from "./infrastructure/redis/redis.js";

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    await connectRedis();

    const server = app.listen(env.PORT, () => {
      logger.info(
        `CommerceOS API running on port ${env.PORT}`
      );
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down...`);

      server.close(async () => {
        try {
          await disconnectRedis();
          await disconnectDatabase();

          logger.info("Application shut down successfully");
          process.exit(0);
        } catch (error) {
          logger.error(error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
  } catch (error) {
    logger.error(error, "Unable to start CommerceOS API");
    process.exit(1);
  }
}

void startServer();