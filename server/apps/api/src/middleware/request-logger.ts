import { pinoHttp } from "pino-http";
import { logger } from "../config/app.config.js";

export const requestLogger = pinoHttp({
  logger
});