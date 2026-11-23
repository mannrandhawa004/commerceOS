# CommerceOS API

Express and TypeScript API starter. The current endpoint is `GET /api/v1/health`.

## Run locally

From the `server` directory:

1. Copy `.env.example` to `.env`.
2. Run `pnpm install`.
3. Run `pnpm dev`.
4. Open `http://localhost:5000/api/v1/health`.

The server connects to MongoDB and Redis before listening; configure both in `.env`.
The health response only indicates that the process responds, not that its dependencies are ready.

## OpenAPI documentation

With the server running, open the interactive Swagger UI at `http://localhost:5000/api/v1/docs/` (replace the port and prefix if configured differently). Expand an endpoint and select **Try it out** to send a request. The underlying specification is also available at `/api/v1/openapi.json`.

The specification describes the implemented routes and the shared error shape. Authentication, business endpoints, readiness checks, and pagination endpoints are not yet implemented. When adding a route, update `src/routes/openapi.ts` with its parameters, authentication, request body, response schemas and errors, and check the contract against actual responses. The configured `API_PREFIX` supplies the spec's server URL.

See [the implementation tracker](../../../docs/README.md) for backend and frontend progress.
