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

The specification describes health and authentication routes and the shared error shape. The role and management endpoints are not yet included in the specification. Readiness checks and pagination are not yet implemented. The configured `API_PREFIX` supplies the spec's server URL.

See [the implementation tracker](../../../docs/README.md) for backend and frontend progress.

## Employee, organization and store management

These endpoints require a Bearer access token for an active user with an active, system `super-admin` role assigned at `global` scope. Run `pnpm --filter @commerce-os/api seed:roles` to create the system roles. Seeding does not assign the first super administrator; a secure owner bootstrap is still required before these endpoints can be used.

All paths below are relative to the configured API prefix (normally `/api/v1`).

| Method | Path | Body or purpose |
| --- | --- | --- |
| POST | `/organizations` | `name`, `slug`, three-letter `currency`, IANA `timezone` |
| GET | `/organizations`, `/organizations/:id` | List or read organizations |
| PATCH | `/organizations/:id` | `version` and fields to change |
| POST | `/organizations/:id/archive` | `version`; active stores must first be archived |
| POST | `/stores` | `organizationId`, `code`, `name`, `address` |
| GET | `/stores`, `/stores/:id` | List or read stores |
| PATCH | `/stores/:id` | `version` and fields to change |
| POST | `/stores/:id/archive` | `version` |
| POST | `/employees` | `firstName`, `lastName`, `email`, `password`; create before assigning a role |
| GET | `/employees`, `/employees/:id` | List or read employees and their assignments |
| PATCH | `/employees/:id` | Change `firstName`, `lastName` or `status` |
| POST | `/employees/:id/assignments` | `roleId`, `organizationId`, `scope` (`organization` or `store`), and `storeIds` |
| DELETE | `/employees/:id/assignments/:assignmentId` | Remove a scoped assignment |

Lists return at most 100 records. Organization and store updates use optimistic version checks; read the latest version before updating. Creating a store also increments its organization's version. Store creation, organization archiving and employee updates require a transaction-capable MongoDB replica set. The scoped-assignment unique index must be created successfully before relying on duplicate protection; review existing assignments for duplicates before enabling it.

The current authorization middleware recognizes only global assignments. Scoped roles can be recorded but do not yet grant access to other API routes. Deactivation revokes existing sessions, but concurrent login and account status transitions still need a dedicated concurrency test and hardening. Audit events, scope-aware authorization, pagination, complete ISO currency validation, and safeguards for store closure once inventory and register features exist remain to be implemented. The endpoints do not implement an owner bootstrap or employee invitation flow.
