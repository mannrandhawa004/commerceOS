import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { requestLogger } from "./middleware/request-logger.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import apiRoutes from "./routes/index.js";

import { authRoutes } from "./modules/auth/index.js";
import roleRoutes from "./modules/roles/routes/role.routes.js";
import { employeeRoutes } from "./modules/employees/index.js";
import { organizationRoutes } from "./modules/organizations/index.js";
import { storeRoutes } from "./modules/stores/index.js";
export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(
  `${env.API_PREFIX}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: { url: `${env.API_PREFIX}/openapi.json` }
  })
);

app.use(env.API_PREFIX, apiRoutes);
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/roles`, roleRoutes);
app.use(`${env.API_PREFIX}/employees`, employeeRoutes);
app.use(`${env.API_PREFIX}/organizations`, organizationRoutes);
app.use(`${env.API_PREFIX}/stores`, storeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;


