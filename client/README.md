# CommerceOS frontend

Next.js App Router frontend. Authentication uses same-origin route handlers and HTTP-only session cookies.

## Getting started

1. Configure and run the backend as described in the root README. From `server/`, run `pnpm --filter @commerce-os/api seed:roles` to seed the customer role before registering. This command updates the built-in role definitions.
2. Copy `.env.example` to `.env.local` and set `COMMERCE_API_URL` if needed. The Next.js server must be able to reach this URL.
3. Run `pnpm install` and `pnpm dev` in `client/`, then open http://localhost:3000.

Use HTTPS in production. The dashboard displays the authenticated profile; business features are not implemented yet.

## Structure

- `src/app`: routes, layouts and Next.js route handlers.
- `src/modules/auth/components`: authentication UI.
- `src/modules/auth/services`: browser and server auth integration.
- `src/modules/auth/types`: auth API types.

Add new product areas under `src/modules/<feature>` and keep route files thin.
