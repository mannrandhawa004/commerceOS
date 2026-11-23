import { Router } from "express";
import { env } from "../config/env.js";

const router = Router();

// Only describe routes that are implemented. Add each new endpoint and its
// request/response schemas here as its backend and frontend slice is built.
router.get("/openapi.json", (_req, res) => {
  res.json({
    openapi: "3.0.3",
    info: {
      title: "CommerceOS API",
      version: "0.1.0",
      description: "The currently implemented CommerceOS HTTP API. Business endpoints and authentication are not implemented yet."
    },
    servers: [{ url: env.API_PREFIX, description: "Configured API prefix on this server" }],
    tags: [{ name: "Health", description: "Process health" }],
    paths: {
      "/openapi.json": {
        get: {
          tags: ["Documentation"],
          operationId: "getOpenApiDocument",
          summary: "Retrieve the OpenAPI document",
          responses: {
            "200": {
              description: "OpenAPI 3.0 document",
              content: { "application/json": { schema: { type: "object", description: "The OpenAPI specification for this API." } } }
            }
          }
        }
      },
      "/health": {
        get: {
          tags: ["Health"],
          operationId: "getHealth",
          summary: "Check whether the API process responds",
          description: "Returns a timestamp. This endpoint does not check MongoDB or Redis readiness.",
          responses: {
            "200": {
              description: "The API process responded",
              content: { "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } } }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        HealthResponse: {
          type: "object",
          required: ["success", "message", "timestamp"],
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "CommerceOS API is running" },
            timestamp: { type: "string", format: "date-time", example: "2026-01-01T12:00:00.000Z" }
          }
        },
        ErrorResponse: {
          type: "object",
          required: ["success", "message", "error"],
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Route not found: GET /api/v1/missing" },
            error: {
              type: "object",
              required: ["code"],
              properties: {
                code: { type: "string", example: "ROUTE_NOT_FOUND" },
                details: { description: "Optional error details; the shape depends on the error." }
              }
            }
          }
        }
      }
    }
  });
});

export default router;
