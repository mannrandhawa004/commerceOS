# CommerceOS implementation progress

Source: `CommerceOS_Complete_Implementation_Guide.docx`, 149 numbered work packages. Last reviewed: 2026-11-23 against the current repository. Check a step only after its implementation and the guide's "Move on when" scenario pass, including failure cases. Partial code does not complete a whole step. Record test evidence beside the step when you finish it. The guide remains the authority for details and dependencies; the referenced supplementary database contracts are not currently present in this repository.

## Current progress

- [x] Express API shell, JSON/body parsing, CORS and Helmet middleware exist (`server/apps/api/src/app.ts`).
- [x] `GET /api/v1/health` returns a process response with a timestamp (`server/apps/api/src/routes/index.ts`). It is not a readiness check.
- [x] MongoDB and Redis connection and shutdown functions exist (`server/apps/api/src/infrastructure/`); the API starts after connecting to both.
- [x] Environment validation and a sample environment file exist (`server/apps/api/src/config/env.ts`, `server/.env.example`).
- [x] Shared success/error response helpers and central error handling exist (`server/apps/api/src/shared/`, `server/apps/api/src/middleware/`).
- [x] Swagger UI is available at `/api/v1/docs/` and the OpenAPI specification at `/api/v1/openapi.json` using the default API prefix.
- [ ] Complete and verify the full guide steps below. The above checkmarks acknowledge existing components, not full acceptance of the related guide steps.

## Work in vertical slices

Complete prerequisite design and safety work before dependent features. Then build a small backend capability, document and test its contract, build its matching frontend, and verify the user journey end to end before starting the next slice. Where a guide frontend step spans several backend features, deliver the relevant part early and leave the full step unchecked until all its acceptance criteria pass. Avoid inventing frontend pages for infrastructure-only tasks.

| Slice | Backend guide steps | Frontend and integration steps |
| --- | --- | --- |
| Foundation | 001–040, including data design and validation | 006–009; establish the frontend shell and shared API client as prerequisites permit |
| Authentication | 041–049 | 050–051: login, registration and end-to-end verification |
| Organization and access | 052–056 | 057: staff and location administration |
| Catalogue | 058–068 | 069: incrementally connect each admin editor; 084–086 for storefront browsing |
| Pricing and promotions | 070–073 | 074: price and promotion controls |
| Inventory | 075–081 | 082: balances, receiving, adjustments and history |
| Customers | 083, 087–088 | 084–089: storefront, account, wishlist and reviews |
| Cart and orders | 090–091, 094–097 | 092–093: cart and checkout; add order screens as APIs land |
| Payments | 098–099, 101–104 | 100 and 105: hosted checkout and payment/refund screens |
| Stock operations | 106–108 | 109: alerts and operations UI |
| Online and offline POS | 110–114, 116–121 | 115, 122: cashier flow, sync and recovery UI |
| Fulfillment | 123–124, 126–128 | 125 and related return/exchange screens |
| Background operations and reports | 129–134 | 131–132 and 135: operational views, updates and dashboards |
| Quality and delivery | 136–149 | Include frontend accessibility, release and end-to-end checks |


## Guide checklist

The task and verification criteria below are taken from the guide. A checked subtask is implemented in the current code; the main checkbox stays open until the complete step and its verification pass. Update both as work progresses.

## Project setup and folder structure

- [ ] **Step 001 — Confirm the release scope**
  - **Implement:** Write the storefront, admin and POS user journeys; separate online MVP from the full offline retail release. Record currency, tax, shipping and return-policy decisions.
  - **Why:** The same business rules must guide every module.
  - **Complete when:** You can trace one online purchase, one cash sale and one return without an undefined decision.

- [ ] **Step 002 — Prepare the development tools**
  - **Implement:** Choose supported compatible Node and pnpm versions, Git, Docker and a code editor. Record versions and installation checks in the root README.
  - **Why:** A repeatable toolchain prevents machine-specific setup failures.
  - **Complete when:** Another clean environment can follow the recorded setup checks.

- [ ] **Step 003 — Initialize repository conventions**
  - **Implement:** Create the Git repository if needed; configure ignore rules, formatting, linting and a small commit convention. Exclude real environment files and generated output.
  - **Why:** Changes need a reviewable history and secrets must stay out of commits.
  - **Complete when:** A sample change passes formatting/linting and ignored secrets do not appear in Git status.
  - [x] Git repository and ignore rules exist.
  - [x] Formatting and lint configuration files exist.

- [ ] **Step 004 — Create pnpm workspaces**
  - **Implement:** Define apps/web, apps/api, apps/worker and packages/shared-types, validation, api-client, config and ui. Add package manifests and commit the reviewed lockfile after installation.
  - **Why:** Applications need shared contracts without becoming tightly coupled.
  - **Complete when:** pnpm recognizes every workspace and resolves one shared package locally.
  - [x] The server pnpm workspace and manifests for API, worker, and shared packages exist.

- [ ] **Step 005 — Create the backend module folders**
  - **Implement:** Under apps/api/src/modules create the domain folders listed in the folder map. Add models, validators, routes, controllers, policies, services, repositories, types, events and tests only as each use case needs them.
  - **Why:** Each domain must own its data and rules.
  - **Complete when:** You can point to the owner of products, inventory, orders and payments without a shared models dumping ground.

- [ ] **Step 006 — Create the frontend feature folders**
  - **Implement:** Create src/app route groups for storefront, admin/admin and pos/pos; add src/features, components, lib and offline. Reserve public for static assets and the service worker.
  - **Why:** Customers, employees and cashiers need distinct navigation and behavior.
  - **Complete when:** The planned URLs do not collide and each feature has one clear home.

- [ ] **Step 007 — Configure TypeScript per application**
  - **Implement:** Create a strict shared base and app-specific settings. Use appropriate Node module settings for API/worker and Next bundler/JSX settings for web.
  - **Why:** One configuration cannot blindly serve both Node and Next builds.
  - **Complete when:** Each app type-checks; intentional invalid types fail the check.
  - [x] Strict TypeScript base and API-specific configuration exist.

- [ ] **Step 008 — Initialize the three app shells**
  - **Implement:** Bootstrap Next.js, an Express app factory and a worker entrypoint. Separate API app creation from the file that listens on a port.
  - **Why:** Tests must import the app without starting a listener; workers must not start the API.
  - **Complete when:** Each app starts independently and importing domain exports has no process side effects.
  - [x] Express app is separated from the listener.

- [ ] **Step 009 — Set up shared contracts and UI tooling**
  - **Implement:** Add shared DTO/scalar types and Zod inputs; configure Tailwind and shadcn/ui; create the API-client boundary. Keep Mongoose models and secrets inside the backend.
  - **Why:** Frontend and backend should agree on transport shapes without sharing persistence internals.
  - **Complete when:** Web can import a DTO and validation schema without pulling server-only code into its bundle.

- [ ] **Step 010 — Configure environment variables**
  - **Implement:** Create .env.example, separate public/private values and validate server configuration at startup. Reserve credentials for Mongo, Redis, JWT, payments, media and monitoring.
  - **Why:** Missing or leaked configuration can break every feature.
  - **Complete when:** Missing required settings fail clearly and no secret appears in client output or logs.
  - [x] Server environment variables are validated at startup and `.env.example` exists.

- [ ] **Step 011 — Plan local Docker services**
  - **Implement:** Prepare Compose for MongoDB replica set, Redis and app services, private networks, volumes and health checks. Initialize the replica set before transaction tests.
  - **Why:** Checkout consistency requires a transaction-capable database.
  - **Complete when:** Infrastructure starts reproducibly and Mongo can commit a small disposable transaction.
  - [x] Development Compose defines MongoDB and Redis services and health checks.

- [ ] **Step 012 — Create the documentation baseline**
  - **Implement:** Keep requirements, architecture, API conventions, database contracts and decisions under docs/. Create a task note for the current step; leave all implementation tasks Not Started until work begins.
  - **Why:** A written contract prevents decisions from drifting while you learn.
  - **Complete when:** The next unfinished step and its acceptance evidence are easy to locate.

## Database design before application APIs

- [ ] **Step 013 — Draw the collection relationships**
  - **Implement:** Use the two diagrams in this guide, then map users/roles/scopes and POS sessions. Decide which module owns each of the 46 planned collections.
  - **Why:** References and ownership must be understood before writing schemas.
  - **Complete when:** Every foreign ID in your proposed model has a known target and owner.

- [ ] **Step 014 — Define common database fields**
  - **Implement:** Use ObjectId identities, organizationId on owned records, UTC dates and createdAt; add updatedAt/version on mutable records. Decide archive versus append-only behavior.
  - **Why:** Consistent metadata simplifies queries, auditing and concurrency checks.
  - **Complete when:** Sample records use consistent ID/date types and never rely on a browser-supplied organization.

- [ ] **Step 015 — Design product and variant documents**
  - **Implement:** Model products as styles and product_variants as sellable combinations. Define stable attribute codes, canonical optionKey, SKU, optional barcode and separate media records.
  - **Why:** Size/color combinations need independent stock and pricing identities.
  - **Complete when:** One T-shirt with three sizes and two colors produces six unique variants.

- [ ] **Step 016 — Design store pricing and promotions**
  - **Implement:** Define price_lists and prices, currency and integer minor amounts; specify organization fallback, store override, promotion precedence and coupon global usage limits.
  - **Why:** Quotes must be deterministic across online checkout and POS.
  - **Complete when:** You can calculate the same variant quote in two stores and explain every difference.

- [ ] **Step 017 — Design inventory records**
  - **Implement:** Define inventory_levels by organization/warehouse/variant; append-only movements with effect IDs; order/device reservations with remaining quantities; transfer and count documents.
  - **Why:** Current balances need an auditable source and safe concurrent allocation.
  - **Complete when:** A two-warehouse example explains available stock using onHand minus reserved and matching movement deltas.

- [ ] **Step 018 — Design customer and order snapshots**
  - **Implement:** Separate users from customers; define reusable addresses and cart lines. Specify immutable order items, SKU/options, price/tax/discount versions, totals, currency and address snapshot.
  - **Why:** A product or profile edit must never rewrite a historical purchase.
  - **Complete when:** Changing a variant title, price or saved address leaves an old order unchanged.

- [ ] **Step 019 — Design payments refunds and provider inboxes**
  - **Implement:** Define separate payment attempts, provider/account/payment IDs, verified event inbox, captured/refunded/pending-refund amounts and refund operation keys.
  - **Why:** External calls can fail ambiguously and callbacks can repeat.
  - **Complete when:** Your state diagram includes pending, unknown, captured and refund reconciliation without treating browser redirects as proof.

- [ ] **Step 020 — Design POS fulfillment and support records**
  - **Implement:** Define shifts, cash movements, immutable client receipts and sync diagnostics; shipments/events, returns/items, notifications, audit, outbox and idempotency records.
  - **Why:** Retail and recovery workflows need evidence beyond an order status.
  - **Complete when:** Each receipt, stock effect and external side effect has a stable identity and recovery path.

- [ ] **Step 021 — Choose embedding and references**
  - **Implement:** Embed bounded order/cart lines and historical snapshots. Reference independent products, variants, customers, balances, payments and event streams. Bound arrays and avoid growing movement histories inside products.
  - **Why:** Document size and write contention grow with unbounded embedded history.
  - **Complete when:** You can justify every array and every reference in your schema draft.

- [ ] **Step 022 — Plan indexes from actual queries**
  - **Implement:** Define tenant-scoped unique SKU/option keys, partial unique barcodes, unique stock keys, provider event/payment identities, POS client IDs and listing indexes. Set TTL only on disposable cleanup data.
  - **Why:** Database constraints prevent races and indexes support real reads.
  - **Complete when:** Each index names a query or invariant; optional values and TTL behavior are explicitly defined.

## Schema design and validation

- [ ] **Step 023 — Create the identity and location schemas**
  - **Implement:** Implement organization, store, warehouse, register, user, role, permission, assignment, session and refresh-token models from the contract. Define enums, required fields and scope references.
  - **Why:** Identity and location rules support every later API.
  - **Complete when:** Valid sample documents save and wrong types, invalid enums and missing required values are rejected.

- [ ] **Step 024 — Create catalogue and pricing schemas**
  - **Implement:** Implement category, brand, attribute, product, variant, media, price-list, price, promotion and coupon models. Include stable option codes, unique indexes and draft/published constraints.
  - **Why:** Merchandising needs flexible options without uncontrolled document shapes.
  - **Complete when:** Invalid option combinations and duplicate identifiers fail with a known validation or duplicate-key error.

- [ ] **Step 025 — Create customer and sales schemas**
  - **Implement:** Implement customer, address, cart, wishlist, review, order, payment, payment-event and refund models. Define nested line/address/totals structures, not Mixed blobs.
  - **Why:** Financial history and ownership need explicit field contracts.
  - **Complete when:** Malformed order lines and mismatched amount/currency data cannot become valid sale records.

- [ ] **Step 026 — Create stock and retail schemas**
  - **Implement:** Implement balances, movements, reservations, transfers, counts, POS sessions, transactions, sync events and cash movements. Define quantities, effect IDs and state/version fields.
  - **Why:** Stock and cash cannot safely use generic unrestricted update objects.
  - **Complete when:** A document cannot store negative reserved stock or an invalid reservation/tender structure.

- [ ] **Step 027 — Create fulfillment and infrastructure schemas**
  - **Implement:** Implement shipment/event, return/item, notification, audit, outbox and idempotency models. Keep immutable evidence distinct from mutable processing state.
  - **Why:** Async work and returns require recoverable durable state.
  - **Complete when:** Each record has bounded payloads, valid transitions and the required unique operational identity.

- [ ] **Step 028 — Write request validation schemas**
  - **Implement:** Create Zod schemas for route params, query strings and create/update bodies. Bound string/array sizes; validate IDs and safe integers; reject unknown mutation fields and NoSQL operators.
  - **Why:** Mongoose validation alone does not protect HTTP inputs.
  - **Complete when:** Unknown privileged fields, invalid IDs and oversized payloads fail before a repository call.

- [ ] **Step 029 — Write business and reference validation**
  - **Implement:** In services, check referenced records exist in the same organization, options match category rules and transitions/amounts are legal. Never assume Mongoose ref/populate enforces foreign keys.
  - **Why:** A correctly typed ID may still identify an invalid or unauthorized record.
  - **Complete when:** A foreign-store or foreign-organization reference is rejected even when it is a valid ObjectId.

- [ ] **Step 030 — Add database validators and index migrations**
  - **Implement:** Create reviewed MongoDB JSON Schema validators and named indexes through migrations. Account for update/bulk-write validation behavior; disable uncontrolled production autoIndex.
  - **Why:** Direct writes and alternative code paths must not bypass critical constraints.
  - **Complete when:** Migrations run twice safely; invalid direct writes and concurrent duplicates are rejected.

- [ ] **Step 031 — Test the schema contracts first**
  - **Implement:** Write focused schema/validator tests using positive and negative documents, optional absent fields, nested line boundaries and unique-index races. Use the supplementary nested contracts as the source.
  - **Why:** The data foundation should fail safely before feature APIs depend on it.
  - **Complete when:** Tests cover required, enum, range, uniqueness and reference rules without implementing business endpoints yet.

## Initial backend and health API

- [ ] **Step 032 — Connect MongoDB cleanly**
  - **Implement:** Create a reusable connection lifecycle, validate the URI, initialize required database metadata and close connections on shutdown.
  - **Why:** A process should know whether its persistence dependency is usable.
  - **Complete when:** Connection failures produce redacted diagnostics and graceful shutdown releases connections.
  - [x] MongoDB connection and disconnection functions are implemented.

- [ ] **Step 033 — Set up the Express middleware order**
  - **Implement:** Configure request IDs, body limits, JSON parsing and routers. Reserve raw-body parsing before JSON middleware for provider webhook paths.
  - **Why:** Middleware order affects validation, security and signature verification.
  - **Complete when:** Ordinary JSON requests work and a raw webhook fixture preserves its exact bytes.
  - [x] JSON parsing, body size limit and API router are configured.

- [ ] **Step 034 — Build the first fast health API**
  - **Implement:** Add GET /health/live with a small constant response. Add GET /health/ready using bounded dependency checks and required startup/index state. Avoid expensive aggregations.
  - **Why:** Operations must distinguish a running process from an instance ready for traffic.
  - **Complete when:** Liveness responds quickly; readiness returns 503 when Mongo is unavailable and reveals no credentials.
  - [x] A basic `GET /health` process response exists.

- [ ] **Step 035 — Build central error handling**
  - **Implement:** Create an application error format with code, message, safe details and requestId. Translate invalid input, missing resource, denied access, conflicts and infrastructure failures consistently.
  - **Why:** Frontend behavior should not depend on stack traces or random error strings.
  - **Complete when:** Malformed JSON, a missing resource and a thrown async error produce predictable safe responses.
  - [x] Application errors, shared response helpers, central error middleware and not-found handling exist.

- [ ] **Step 036 — Add Pino request logging**
  - **Implement:** Log request IDs, operation names, status and duration; redact passwords, cookies, tokens, personal addresses and payment data.
  - **Why:** Failures must be traceable without leaking sensitive content.
  - **Complete when:** A failing request can be found by requestId and its logs contain no test secrets.
  - [x] Pino and HTTP request logging are configured.

- [ ] **Step 037 — Handle basic API security**
  - **Implement:** Configure approved CORS origins, secure headers, safe proxy trust, body limits and cookie settings. Define CSRF protection for cookie-authenticated mutations.
  - **Why:** Defaults and client-side checks are insufficient protection.
  - **Complete when:** Disallowed origins and missing CSRF proof fail while an approved request succeeds.
  - [x] Helmet, configured CORS and a JSON body size limit are in place.

- [ ] **Step 038 — Handle rate limits early**
  - **Implement:** Add shared Redis-backed limits where multiple API instances will run; define stricter login/registration/reset rules and broader API rules. Use trusted client IP handling, Retry-After and provider-specific webhook capacity.
  - **Why:** Abuse protection is needed before public authentication endpoints are exposed.
  - **Complete when:** Repeated test requests receive 429 consistently and spoofed forwarding headers cannot bypass the limit.

- [ ] **Step 039 — Create OpenAPI and API conventions**
  - **Implement:** Document /api/v1, DTOs, pagination, errors, auth and the health endpoints. Keep internal models and secrets out of responses.
  - **Why:** Frontend development needs a stable, discoverable contract.
  - **Complete when:** A health request and its response/error shapes match the published specification.
  - [x] Interactive Swagger UI and OpenAPI documentation exist for the implemented routes.

- [ ] **Step 040 — Create the backend test harness**
  - **Implement:** Use Vitest and Supertest with an imported Express app, isolated Mongo replica-set data, deterministic clocks and mocked external adapters.
  - **Why:** Integration tests must exercise real persistence and middleware behavior.
  - **Complete when:** Health and error tests run without a real payment account or a manually started API server.

## Authentication

- [ ] **Step 041 — Create the owner bootstrap path**
  - **Implement:** Design an explicit first-owner provisioning action and controlled employee invitations. Keep staff role grants out of public registration.
  - **Why:** Someone must administer the organization without allowing public privilege creation.
  - **Complete when:** The owner can be provisioned once and a public body containing a staff role is rejected.

- [ ] **Step 042 — Build customer registration API**
  - **Implement:** Add POST /auth/register with normalized email, password validation/hash and customer creation in a coherent transaction. Return a safe account DTO.
  - **Why:** Online shoppers need an account without becoming employees.
  - **Complete when:** Valid registration creates the expected records; duplicate email and invalid input return safe errors.

- [ ] **Step 043 — Build login API**
  - **Implement:** Add POST /auth/login with generic credential errors, password verification, active-user checks, session creation and a hashed refresh credential.
  - **Why:** Credentials must establish a revocable session rather than expose a password hash.
  - **Complete when:** Correct credentials succeed; wrong/disabled accounts fail and no credential material appears in the response.

- [ ] **Step 044 — Build access-token middleware**
  - **Implement:** Verify an allowed JWT algorithm, signature, issuer, audience and expiry. Resolve the session and trusted organization context; attach a minimal actor DTO.
  - **Why:** A valid-looking token is not sufficient authority to access a record.
  - **Complete when:** Expired, forged and revoked-session tokens receive 401 and cannot reach protected services.

- [ ] **Step 045 — Build refresh rotation API**
  - **Implement:** Add POST /auth/refresh that atomically spends the active token and creates its replacement. Preserve hashes until the family reuse-detection cleanup window.
  - **Why:** Long-lived sessions need renewal and a way to detect stolen-token reuse.
  - **Complete when:** A replayed spent token revokes the family; parallel refresh behavior is defined and tested.

- [ ] **Step 046 — Build logout APIs**
  - **Implement:** Add current-session logout and revoke-all-sessions actions. Clear the matching cookie and revoke server records; validate CSRF for cookie mutations.
  - **Why:** Deleting browser state alone does not invalidate a stolen session.
  - **Complete when:** The revoked session fails immediately even before TTL cleanup occurs.

- [ ] **Step 047 — Build current-user and session APIs**
  - **Implement:** Add GET /me, GET /me/sessions and own-session revocation. Project safe profile fields and enforce identity ownership.
  - **Why:** The UI needs authoritative identity and device management.
  - **Complete when:** One user cannot inspect or revoke another user’s sessions by changing an ID.

- [ ] **Step 048 — Build password reset and change**
  - **Implement:** Use short-lived one-time hashed reset tokens, generic request responses and throttling. Invalidate relevant sessions after reset/change; introduce a small recovery-token collection if needed and document it.
  - **Why:** Users need secure recovery without account enumeration.
  - **Complete when:** A token works once, expires correctly and cannot reset another account.

- [ ] **Step 049 — Add authentication audit events**
  - **Implement:** Record login/security actions, resets and revocations with safe metadata; avoid logging passwords, tokens or full recovery links.
  - **Why:** Account incidents need an understandable trail.
  - **Complete when:** A reset/revocation is visible in restricted audit history without reusable credentials.

- [ ] **Step 050 — Build login and registration frontend**
  - **Implement:** Use React Hook Form/Zod, packages/api-client and explicit loading/error states. Serialize refresh attempts and route expired sessions back to sign-in.
  - **Why:** Users need a usable flow over the APIs you just built.
  - **Complete when:** A user can register, sign in, refresh and log out through the browser without duplicate submissions.

- [ ] **Step 051 — Verify authentication end to end**
  - **Implement:** Test registration/login rate limits, bad tokens, refresh reuse, CSRF, cookie flags, account enumeration and logout revocation in integration/E2E checks.
  - **Why:** Authentication is a release boundary for all later protected APIs.
  - **Complete when:** The negative cases fail consistently and the legitimate browser flow remains usable.

## Roles organization stores and warehouses

- [ ] **Step 052 — Build permission and role APIs**
  - **Implement:** Create a controlled permission registry and scoped role-management APIs; forbid arbitrary permission keys and grants beyond the actor’s delegable authority.
  - **Why:** Role administration must not become a privilege-escalation endpoint.
  - **Complete when:** A manager cannot grant permissions or scope they do not control.

- [ ] **Step 053 — Build resource authorization policies**
  - **Implement:** Evaluate current roles and organization/store/warehouse assignments against the actual target record. Keep checks in services so workers obey them too.
  - **Why:** Hidden buttons and role names alone cannot protect records.
  - **Complete when:** A store-A employee cannot read, edit, refund or export store-B resources.

- [ ] **Step 054 — Build organization and store APIs**
  - **Implement:** Add settings and store create/list/detail/update/archive routes with currency/timezone validation and version checks.
  - **Why:** Catalogue, pricing and orders need a trusted operating context.
  - **Complete when:** Concurrent edits conflict clearly and referenced stores cannot disappear through hard deletion.

- [ ] **Step 055 — Build warehouse APIs**
  - **Implement:** Add warehouse management and store fulfillment mappings; validate organization ownership and block closure with unresolved stock/reservations.
  - **Why:** Physical inventory needs stable locations and valid fulfillment routes.
  - **Complete when:** A central warehouse can serve multiple stores and unsafe closure is rejected.

- [ ] **Step 056 — Build register and employee assignment APIs**
  - **Implement:** Enroll/disable devices and assign employees to allowed scopes. Treat device ID as an identifier, not an authentication secret.
  - **Why:** A cashier must be attached to an authorized terminal and store.
  - **Complete when:** Disabled devices cannot initiate new online activity and assignments are audited.

- [ ] **Step 057 — Build organization and staff admin screens**
  - **Implement:** Add store/warehouse/register editors and role/employee assignment screens with safe error and forbidden states.
  - **Why:** Owners need a controlled interface to operate the access model.
  - **Complete when:** An authorized owner completes setup; a lower-privilege employee sees denied actions and receives API denial too.

## Product catalogue

- [ ] **Step 058 — Build brand APIs**
  - **Implement:** Add brand create/list/update/archive operations with normalized unique slugs and organization policies.
  - **Why:** Products need a reusable brand directory.
  - **Complete when:** Duplicates return 409 and archiving a brand does not corrupt historic orders.

- [ ] **Step 059 — Build category APIs**
  - **Implement:** Add nested categories with parent/ancestor references, applicable attribute rules and cycle prevention.
  - **Why:** Navigation and clothing options depend on a valid hierarchy.
  - **Complete when:** Moving a category under its descendant fails and listings return the intended subtree.

- [ ] **Step 060 — Build attribute and size-chart APIs**
  - **Implement:** Manage typed color/size/material options with stable codes and bounded size-chart rows. Separate labels from stored option identity.
  - **Why:** Labels may change while variant identities must remain stable.
  - **Complete when:** Renaming a color label leaves the same variant combination valid.

- [ ] **Step 061 — Build product creation API**
  - **Implement:** Add POST /products for draft style content, categories, brand and allowed attributes. Validate references through owning services.
  - **Why:** A style must exist before its sellable variants are created.
  - **Complete when:** A valid draft saves and unknown category/attribute references are rejected.

- [ ] **Step 062 — Build product detail and update APIs**
  - **Implement:** Add scoped detail/read and allowlisted versioned edits. Return DTOs; never allow a body to overwrite organizationId, audit fields or inventory.
  - **Why:** Staff need safe editing without mass assignment or lost updates.
  - **Complete when:** A stale edit returns a conflict and unauthorized fields never reach storage.

- [ ] **Step 063 — Build variant APIs**
  - **Implement:** Create/update/archive size/color combinations, canonicalize optionKey and enforce SKU/barcode uniqueness in MongoDB.
  - **Why:** A sellable unit needs one stable identity across catalogue, stock and receipts.
  - **Complete when:** Parallel duplicate SKU/option submissions yield one successful variant and a clear conflict.

- [ ] **Step 064 — Build media upload and association APIs**
  - **Implement:** Choose S3 or Cloudinary, issue restricted upload intents and verify completion before associating media. Support ordering and alt text; detach before asynchronous cleanup.
  - **Why:** Product images need safe ownership and useful presentation.
  - **Complete when:** A forged upload key, oversized file or foreign-product association is rejected.

- [ ] **Step 065 — Build publish and archive operations**
  - **Implement:** Publish only when category/variant/media/pricing requirements are satisfied; archive instead of deleting referenced catalogue identities.
  - **Why:** Incomplete styles should not appear as purchasable products.
  - **Complete when:** An incomplete draft fails publication and an archived variant remains readable in old order snapshots.

- [ ] **Step 066 — Build product listing search and filters**
  - **Implement:** Add allowlisted category/brand/size/color filters and sort modes with capped cursor pagination. Ensure one variant satisfies the complete option filter.
  - **Why:** Shoppers need correct results with bounded database work.
  - **Complete when:** A style is not returned when size matches one variant but color only matches another.

- [ ] **Step 067 — Verify catalogue indexes and query plans**
  - **Implement:** Use realistic products/variants and explain the exact filter/sort queries. Add only measured indexes and avoid compound indexes with two array fields.
  - **Why:** Thousands of styles can hide much larger variant query costs.
  - **Complete when:** Representative pages use acceptable examined/returned ratios without deep offset scans.

- [ ] **Step 068 — Build product import and export**
  - **Implement:** Validate a preview, process bounded batches with row-level outcomes, use stable import identities and protect export downloads/formula cells.
  - **Why:** Bulk catalogue work must be recoverable and safe.
  - **Complete when:** Replaying a batch creates no duplicate SKU and failed rows are individually identifiable.

- [ ] **Step 069 — Build catalogue admin frontend**
  - **Implement:** Implement brands/categories/attributes editors, a product form, variant matrix, media control and publication/list screens. Integrate one completed API slice at a time.
  - **Why:** Staff need to use the backend without relying on database edits.
  - **Complete when:** Create a T-shirt, six variants, images and a valid published listing entirely through the admin UI.

## Pricing promotions and tax

- [ ] **Step 070 — Build price-list APIs**
  - **Implement:** Create organization defaults and store-specific lists with currency/version rules. Select an active default explicitly rather than guessing among overlapping lists.
  - **Why:** Store quotes need deterministic precedence.
  - **Complete when:** A store override is selected correctly and missing currency/list configuration fails clearly.

- [ ] **Step 071 — Build variant price editing APIs**
  - **Implement:** Add safe integer minor-unit amounts, optional compare-at amounts and optimistic versioned updates. Record price changes in audit history.
  - **Why:** Concurrent edits must not silently overwrite prices.
  - **Complete when:** Stale edits fail and floating-point/unsafe monetary inputs are rejected.

- [ ] **Step 072 — Build the pricing quote service**
  - **Implement:** Calculate server-side line amounts, allowed discounts, shipping and tax using a documented inclusive/exclusive policy and deterministic remainder allocation.
  - **Why:** Checkout and POS must reuse exactly the same calculation rules.
  - **Complete when:** Allocated line totals equal the order total for awkward rounding examples.

- [ ] **Step 073 — Build promotion and coupon APIs**
  - **Implement:** Implement bounded eligibility rules, priority/stacking, start/end times and atomic global quotas. Keep per-customer limits out until a redemption ledger exists.
  - **Why:** Discounts need enforceable limits rather than arbitrary executable rules.
  - **Complete when:** Concurrent final-use redemptions cannot both succeed and a failed order does not consume quota.

- [ ] **Step 074 — Build pricing and promotion frontend**
  - **Implement:** Add store price editors, rule forms and quote previews showing discount/tax breakdowns.
  - **Why:** Staff need to see and verify what a promotion will charge.
  - **Complete when:** The displayed preview matches the authoritative service for eligible and ineligible carts.

## Core inventory

- [ ] **Step 075 — Build balance and availability reads**
  - **Implement:** Query inventory_levels by variant and warehouse; derive available as onHand minus reserved. Scope every lookup by organization and allowed location.
  - **Why:** Checkout needs real available stock rather than a cached merchandising value.
  - **Complete when:** Two warehouses report separate correct availability for the same SKU.

- [ ] **Step 076 — Build stock receiving API**
  - **Implement:** Receive positive quantities through the inventory service, updating the balance and appending a deterministic movement in one transaction.
  - **Why:** Initial and replenished stock require an auditable source.
  - **Complete when:** Retrying one receiving operation changes stock once and creates one effect record.

- [ ] **Step 077 — Build stock adjustment API**
  - **Implement:** Require a reason and warehouse permission; compare version and available quantity before reducing stock. Correct errors with new movements.
  - **Why:** Manual adjustments must not erase evidence or consume allocated items.
  - **Complete when:** An adjustment cannot reduce onHand below reserved and its actor/reason is traceable.

- [ ] **Step 078 — Build reservation creation**
  - **Implement:** Use a conditional atomic balance update and a short multi-document transaction for reservation, movement and outbox. Reserve all order lines or none.
  - **Why:** Two requests must not both claim the final unit.
  - **Complete when:** A last-unit concurrency test produces at most one active allocation and no partial multi-line reservation.

- [ ] **Step 079 — Build reservation release and expiry**
  - **Implement:** Compare reservation state/version, release only outstanding quantity and append one release movement. Run expiry through a job, not TTL deletion.
  - **Why:** Cancelled/expired purchase intent must return its allocation safely.
  - **Complete when:** Repeated expiry/cancellation cannot double-release stock.

- [ ] **Step 080 — Build consumption and partial quantities**
  - **Implement:** Consume allocated stock at fulfillment or immediate POS sale; track consumed/released quantities with bounded totals and stable effect IDs.
  - **Why:** Payment and physical handoff are different events.
  - **Complete when:** A partial shipment consumes only its lines and replayed handoff does not deduct again.

- [ ] **Step 081 — Build inventory history and reconciliation**
  - **Implement:** Add movement timelines and a restricted check that compares ledger deltas, balances and active reservation quantities. Surface mismatches for audited correction.
  - **Why:** A balance alone cannot explain how stock changed.
  - **Complete when:** Receiving, reserving, releasing and consuming produce a reconcilable history.

- [ ] **Step 082 — Build inventory admin screens**
  - **Implement:** Add warehouse balance/search, receiving/adjustment forms and movement detail. Show version conflicts and insufficient available stock explicitly.
  - **Why:** Staff need a safe alternative to directly editing Mongo documents.
  - **Complete when:** A permitted staff member can receive stock and explain its new balance from the UI.

## Customers and storefront

- [ ] **Step 083 — Build customer profile and address APIs**
  - **Implement:** Add own-profile and owned address-book CRUD with country/length validation. Treat guest customer identity separately from employee roles.
  - **Why:** Customers need reusable details and ownership isolation.
  - **Complete when:** Changing an address never changes an existing order and cannot target another customer.

- [ ] **Step 084 — Build the storefront application shell**
  - **Implement:** Create responsive navigation, layouts, accessible shared controls and error/loading/empty screens. Use the public route group without private admin data caching.
  - **Why:** The catalogue needs a usable customer-facing entry point.
  - **Complete when:** Mobile and keyboard users can navigate between listing and detail pages.

- [ ] **Step 085 — Build product listing and filter UI**
  - **Implement:** Fetch the catalogue through api-client/TanStack Query, place filters in the URL and handle cursor pages and no-results states.
  - **Why:** Search/filter choices should survive reloads and shared links.
  - **Complete when:** A filtered URL reconstructs the same page without showing stale unrelated results.

- [ ] **Step 086 — Build product detail and variant selection**
  - **Implement:** Render images, size chart, options, current store price and availability. Disable invalid combinations and unavailable purchase actions.
  - **Why:** A customer must choose a specific sellable variant.
  - **Complete when:** Selecting size/color resolves one SKU and changes the displayed price/stock correctly.

- [ ] **Step 087 — Build customer account and wishlist**
  - **Implement:** Add profile/address/order navigation and saved-product APIs/UI with a bounded unique set of products.
  - **Why:** Customers need to manage details and revisit styles.
  - **Complete when:** Sign-in protects account pages and repeated wishlist additions do not duplicate entries.

- [ ] **Step 088 — Build verified review and moderation flows**
  - **Implement:** Allow reviews only for owned delivered purchases; enforce one review policy, plain-text limits and staff moderation.
  - **Why:** Feedback should represent real purchases and remain safe to display.
  - **Complete when:** An unrelated customer cannot submit a verified review and submitted script text is escaped.

- [ ] **Step 089 — Add SEO and frontend quality checks**
  - **Implement:** Implement metadata, canonical URLs, image sizing and intentional cache policies. Test accessibility and small screens while building these pages.
  - **Why:** Discoverability and usability should not wait until release.
  - **Complete when:** Product metadata is meaningful and private account responses are never shared between users.

## Cart checkout and orders

- [ ] **Step 090 — Build persistent cart APIs**
  - **Implement:** Add read/add/update/remove with bounded variant quantities and cart versions. Store customer or hashed guest identity; cached totals remain nonbinding.
  - **Why:** A cart represents purchase intent across reloads.
  - **Complete when:** Invalid variants/quantities fail and a version conflict does not silently discard an edit.

- [ ] **Step 091 — Build guest cart merge**
  - **Implement:** Merge into the signed-in cart using a documented quantity policy and repeatable operation identity; expose unavailable items.
  - **Why:** Login should preserve intent without duplicating quantities on retries.
  - **Complete when:** Replaying the merge produces the same cart once.

- [ ] **Step 092 — Build cart frontend**
  - **Implement:** Add item controls, removal, subtotal preview and explicit loading/retry/conflict states. Use server queries as truth and keep only temporary UI state in Zustand.
  - **Why:** Customers need to review and correct their purchase.
  - **Complete when:** Reload preserves the cart and a failed quantity mutation restores a consistent display.

- [ ] **Step 093 — Build checkout quote API and UI**
  - **Implement:** Validate address, shipping method, active variants and current price/promotion rules; return a versioned expiring quote for review.
  - **Why:** The final agreement must use fresh server-approved values.
  - **Complete when:** A stale or changed quote requires customer review instead of silently charging a different total.

- [ ] **Step 094 — Build command idempotency support**
  - **Implement:** Bind a key to actor/organization/operation and canonical request hash; store a recoverable in-progress state and durable result/resource link.
  - **Why:** Retries after lost responses must not create duplicate orders.
  - **Complete when:** The same key/body returns one result and the same key with a changed body returns 409.

- [ ] **Step 095 — Build order creation API**
  - **Implement:** In one local transaction validate the quote, reserve all lines, apply eligible coupon quota, write immutable order snapshots and append outbox/audit effects.
  - **Why:** Commercial agreement and stock allocation must commit coherently.
  - **Complete when:** An unavailable line rolls back the entire local order command and retry cannot create a second order.

- [ ] **Step 096 — Build order read history and admin listing**
  - **Implement:** Add own-customer history, staff-scoped list/detail, cursor pagination and safe DTOs. Keep financial and fulfillment state separate.
  - **Why:** Different audiences need different permitted views of the same purchase.
  - **Complete when:** One customer/store cannot fetch another’s order by ID or export filter.

- [ ] **Step 097 — Build order transitions and cancellation**
  - **Implement:** Define allowed source/destination states with version checks. Cancel releases outstanding allocation once; paid cancellation creates durable refund intent.
  - **Why:** Order status must reflect real business progress and compensation.
  - **Complete when:** Repeated cancellation is safe and a late capture cannot silently resurrect a cancelled order.

## Payments webhooks and refunds

- [ ] **Step 098 — Define the payment provider contract**
  - **Implement:** Specify create-attempt, verify-event, fetch-status and refund operations with provider IDs, currency, amount and stable operation references. Implement one provider first.
  - **Why:** Stripe and Razorpay have different contracts while orders need consistent internal behavior.
  - **Complete when:** Provider adapters can be tested with the same internal outcomes without sharing signature logic.

- [ ] **Step 099 — Build payment-attempt API**
  - **Implement:** After local order commit, create a provider intent/order outside Mongo transactions and persist its identity and attempt state. Treat timeouts as unknown.
  - **Why:** A Mongo transaction cannot atomically commit an external charge.
  - **Complete when:** A timed-out call does not trigger an uncontrolled second charge; reconciliation can find its identity.

- [ ] **Step 100 — Build hosted checkout frontend**
  - **Implement:** Use the selected provider’s supported hosted/payment UI, show pending/failed/unknown states and read final status from the backend.
  - **Why:** A browser success callback can be forged or arrive before authoritative evidence.
  - **Complete when:** Editing a browser callback cannot mark an order paid.

- [ ] **Step 101 — Build signed webhook ingress**
  - **Implement:** Receive exact raw bytes, verify the provider-specific signature/account, persist the unique provider event inbox and acknowledge after durable receipt.
  - **Why:** Authentic callbacks can arrive repeatedly or out of order.
  - **Complete when:** Invalid signatures fail; repeated valid delivery creates one inbox identity and is acknowledged safely.

- [ ] **Step 102 — Build payment event processing**
  - **Implement:** Claim inbox work with a lease, verify mapping/amount/currency and apply monotonic payment transitions with unique provider-payment effects. Coordinate captured state with active stock allocation.
  - **Why:** Different event IDs may describe the same capture, and allocation may already have expired.
  - **Complete when:** Duplicate/out-of-order evidence applies one capture effect; a paid stock exception is explicit.

- [ ] **Step 103 — Build reconciliation and failure recovery**
  - **Implement:** Poll unresolved provider operations, recover expired leases and resolve canonical payment state. Persist compensating refund intent for cancelled/unallocatable captured orders.
  - **Why:** A lost network response does not tell you whether money moved.
  - **Complete when:** A delayed successful capture is found and either correctly confirms allocation or enters compensation/review.

- [ ] **Step 104 — Build refund request and processing APIs**
  - **Implement:** Authorize the target order/store and refund limits; atomically reserve refundable capacity. Call the provider after commit with a stable reference and reconcile unknown outcomes.
  - **Why:** Parallel refunds must not return more than the captured amount.
  - **Complete when:** Successful plus pending refunds never exceed captured money and unknown operations retain their capacity.

- [ ] **Step 105 — Build payment and refund screens and tests**
  - **Implement:** Show customer payment progress and staff capture/refund history with safe retry actions. Test amount tampering, webhook replay, cancellation races and concurrent refunds.
  - **Why:** Operators need to see uncertainty and fix it without repeating money effects.
  - **Complete when:** Sandbox purchase and partial refund pass end to end, including a deliberately lost response.

## Transfers counts and inventory alerts

- [ ] **Step 106 — Build transfer creation and approval**
  - **Implement:** Create bounded transfer lines, distinct source/destination warehouses and permissions at both ends. Reserve source quantities on approval.
  - **Why:** Moving stock needs controlled allocation before dispatch.
  - **Complete when:** Unauthorized endpoints, same-location transfers and insufficient source stock are rejected.

- [ ] **Step 107 — Build transfer dispatch and partial receipt**
  - **Implement:** Consume source allocation on dispatch, track in-transit quantities and add destination stock only for accepted receipts; record loss/damage separately.
  - **Why:** Stock must not exist at both ends while it is traveling.
  - **Complete when:** Replayed partial receipts do not inflate stock and received plus lost never exceeds dispatched.

- [ ] **Step 108 — Build stock-count workflow**
  - **Implement:** Capture balance/version baselines, freeze the relevant count location initially, collect physical counts and post approved differences through adjustment movements.
  - **Why:** Writing a stale count over current stock loses intervening sales.
  - **Complete when:** A stale count cannot overwrite newer stock and posting the same count twice has one effect.

- [ ] **Step 109 — Build low-stock alerts and operations UI**
  - **Implement:** Add thresholds, crossing/reminder deduplication, transfer screens and count discrepancy review.
  - **Why:** Staff need practical replenishment and correction workflows.
  - **Complete when:** An alert is not emitted for every read and approved transfers/counts reconcile in the UI.

## Online POS

- [ ] **Step 110 — Build POS sign-in and register opening**
  - **Implement:** Require enrolled terminal/store scope and an authorized cashier; open one shift with currency and counted opening cash.
  - **Why:** Every till needs an accountable starting point.
  - **Complete when:** A second open shift for the register fails and a disabled device cannot start one.

- [ ] **Step 111 — Build scanner lookup and POS cart**
  - **Implement:** Add barcode lookup, keyboard scanner input and a touch-friendly variant/cart screen; reuse catalogue/pricing rules.
  - **Why:** Cashiers need fast item entry without a separate pricing engine.
  - **Complete when:** Repeated scan increments the intended SKU and unknown barcodes show a recoverable error.

- [ ] **Step 112 — Build POS sale and split tenders**
  - **Implement:** Create a stable receipt identity, reserve/consume stock for immediate handoff and record cash/provider tenders. Verify provider evidence online; calculate change only for cash.
  - **Why:** A sale must reconcile goods and money even when multiple tenders are used.
  - **Complete when:** Tender totals equal due, a replay creates one sale and an unverified card tender cannot complete it.

- [ ] **Step 113 — Build receipts and cash movement APIs**
  - **Implement:** Generate a printable receipt from immutable server data; record paid-in/out, cash received, change and refunds as signed ledger effects.
  - **Why:** Cash and customer evidence must remain traceable.
  - **Complete when:** Reprints preserve receipt identity and a retried cash operation creates one ledger effect.

- [ ] **Step 114 — Build register closing and reconciliation**
  - **Implement:** Compute expected cash from opening plus movements, accept counted closing cash and require approval for policy-defined discrepancies.
  - **Why:** Shift closure must explain the difference between expected and actual cash.
  - **Complete when:** Duplicate close returns the same result and unresolved tenders/receipts are visibly handled.

- [ ] **Step 115 — Verify the online cashier workflow**
  - **Implement:** Test keyboard/touch behavior, store isolation, scan/cart discounts, split tenders, receipt retries and closing cash.
  - **Why:** The full POS path must work before offline complexity is added.
  - **Complete when:** A cashier completes and reconciles a real multi-item test sale without direct database edits.

## Offline POS and synchronization

- [ ] **Step 116 — Build service worker and cache lifecycle**
  - **Implement:** Cache the POS shell and required assets with explicit update/version behavior; avoid caching private API responses indiscriminately.
  - **Why:** The terminal needs a stable interface during network loss.
  - **Complete when:** A provisioned terminal opens offline and deploying an update does not erase pending work.

- [ ] **Step 117 — Create the Dexie database and migrations**
  - **Implement:** Define local catalogue, prices, allowances, carts, receipts, syncQueue and metadata tables. Preserve unsynced receipts across upgrades and storage errors.
  - **Why:** Local records need a durable schema and safe evolution.
  - **Complete when:** A schema upgrade keeps queued receipts and a failed migration stops sales with a visible recovery path.

- [ ] **Step 118 — Build catalogue snapshot and delta sync**
  - **Implement:** Download only authorized store/device data, version products/prices together and apply tombstones for archived items. Recover expired delta cursors with a full snapshot.
  - **Why:** An offline terminal must not combine incompatible catalogue and price versions.
  - **Complete when:** A removed SKU disappears after sync and interrupted updates do not leave a mixed cache.

- [ ] **Step 119 — Build device stock allowances**
  - **Implement:** Allocate bounded warehouse/variant stock to the enrolled terminal, enforce signed/versioned lease policy and one local writer. Do not auto-release unresolved allowance on expiry.
  - **Why:** Disconnected terminals cannot safely compete for unrestricted shared stock.
  - **Complete when:** Two devices have separate allocations and a cloned/second writer cannot spend the same local allowance unchecked.

- [ ] **Step 120 — Build offline cash receipt creation**
  - **Implement:** In one IndexedDB transaction save the receipt, reduce the local allowance and queue the same UUID/body for upload. Show a provisional receipt only after durable save.
  - **Why:** A displayed successful sale must have recoverable evidence.
  - **Complete when:** A forced crash cannot leave an acknowledged sale without its queued receipt.

- [ ] **Step 121 — Build idempotent server sync API**
  - **Implement:** Authenticate device/cashier scope, validate the original payload/policy/allowance and enforce unique organization/device/clientTransactionId plus payload hash. Commit accepted order/stock effects together.
  - **Why:** Repeated uploads and lost responses must represent one sale.
  - **Complete when:** Concurrent duplicate uploads return one order; changing the body under the same UUID returns conflict.

- [ ] **Step 122 — Build retries conflict review and recovery UI**
  - **Implement:** Use queue leases, bounded batches, backoff/jitter, per-item outcomes and foreground Sync now. Pause on expired auth; show rejected/needs-review receipts without deleting cash evidence.
  - **Why:** Offline conflicts need operator resolution rather than silent rewriting or duplicate entry.
  - **Complete when:** Lose an accepted response, retry it and recover the same receipt; one rejected batch item does not duplicate accepted items.

## Shipping returns and exchanges

- [ ] **Step 123 — Build shipping quotes and methods**
  - **Implement:** Define approved store shipping methods, serviceable addresses, charges and policy versions; reuse quote totals at checkout.
  - **Why:** Delivery costs and eligibility must be known before payment.
  - **Complete when:** Unsupported destinations fail clearly and shipping is not silently recalculated after order acceptance.

- [ ] **Step 124 — Build shipment creation and handoff**
  - **Implement:** Create packages using order-line quantities and provider references. Make label creation distinct from physical dispatch; consume allocation on actual handoff once.
  - **Why:** A printed label is not proof that stock left the warehouse.
  - **Complete when:** Two packages cannot exceed remaining line quantity and repeated handoff cannot deduct again.

- [ ] **Step 125 — Build tracking event ingestion and screens**
  - **Implement:** Verify provider authenticity, deduplicate shipment events and apply allowed progress/exception states. Show partial shipment/delivery per package.
  - **Why:** Old callbacks must not move a delivered package backward.
  - **Complete when:** Out-of-order events do not demote state and one delivered parcel does not complete unshipped lines.

- [ ] **Step 126 — Build return request and approval APIs**
  - **Implement:** Check customer ownership, delivery window, reasons and remaining eligible quantity; guard concurrent return allocation on the same order line.
  - **Why:** Customers cannot return more units than they received.
  - **Complete when:** Two requests for the final returnable unit cannot both allocate it.

- [ ] **Step 127 — Build return receiving and inspection**
  - **Implement:** Record received/approved quantities and condition; send sellable items to an allowed warehouse and damaged goods to quarantine/write-off policy.
  - **Why:** Receiving an item does not automatically make it sellable.
  - **Complete when:** Restock is a separate idempotent movement and a damaged item does not increase sellable stock.

- [ ] **Step 128 — Connect returns to refund and exchange flows**
  - **Implement:** Reuse the refund service; create linked replacement orders with fresh pricing and stock reservation and record any difference payment/refund.
  - **Why:** Exchanges must preserve the original financial history and separately fund replacement goods.
  - **Complete when:** A replacement cannot bypass payment/stock controls and repeating a restock/refund action has one effect.

## Jobs notifications and real time

- [ ] **Step 129 — Harden the transactional outbox dispatcher**
  - **Implement:** Write outbox records with domain commits, claim with leases, enqueue stable job identities and recover crashes between enqueue and acknowledgement.
  - **Why:** Direct post-commit queue calls can lose required work.
  - **Complete when:** A crash after enqueue produces a safe repeat, not a missing or duplicated business effect.

- [ ] **Step 130 — Build retry-safe BullMQ workers**
  - **Implement:** Reuse public domain services in the worker; define timeouts, concurrency, backoff, permanent failures and durable per-effect deduplication beyond queue retention.
  - **Why:** Delivery is at least once and jobs may run again long after a Redis job ID is removed.
  - **Complete when:** A repeated effect remains safe after queue history is deleted.

- [ ] **Step 131 — Build notifications scheduling and dead-letter review**
  - **Implement:** Create scoped email/order/stock notification intents, reservation-expiry schedules and a failed-job operator view with reasoned replay.
  - **Why:** Customers need updates and operators need to recover exhausted work.
  - **Complete when:** A poison job is visible and can be reviewed without blocking unrelated work.

- [ ] **Step 132 — Build Socket.IO updates and reconnect handling**
  - **Implement:** Authenticate handshakes and authorize store/organization rooms server-side; emit after commit and refetch REST state on reconnect.
  - **Why:** Real-time messages improve responsiveness but may be missed.
  - **Complete when:** A store-A socket cannot join store B and reconnect recovers authoritative state.

## Reports and exports

- [ ] **Step 133 — Build sales and performance report APIs**
  - **Implement:** Aggregate order snapshots by date/store/product/customer and currency, with documented gross/net/refund definitions and timezone boundaries.
  - **Why:** Owners need reports that reconcile to real transactions.
  - **Complete when:** Refunds are netted according to the stated definition and different currencies are never summed.

- [ ] **Step 134 — Build inventory margin and POS reports**
  - **Implement:** Report stock/movements, counts/transfers, cash reconciliation and estimated margin only when historical cost snapshots exist.
  - **Why:** Operations need explanatory reports rather than invented profit figures.
  - **Complete when:** Missing cost is shown as unavailable margin and a till total matches its cash ledger.

- [ ] **Step 135 — Build report dashboards and export jobs**
  - **Implement:** Add date/location filters, charts, loading/empty states and scoped asynchronous exports with expiring download links and spreadsheet formula defenses.
  - **Why:** Large reports must remain usable and protect customer/business data.
  - **Complete when:** A user cannot download another store’s export and large exports do not block normal API traffic.

## Security testing and optimization

- [ ] **Step 136 — Audit rate limits and resource access**
  - **Implement:** Review public, auth, bulk, report and high-cost endpoints; tune limits with proxy/Redis topology. Test object/store access for REST, jobs, exports and sockets.
  - **Why:** Early controls must still hold as the API surface expands.
  - **Complete when:** Changing an ID, filter or socket room never grants broader scope and limits remain consistent across API instances.

- [ ] **Step 137 — Complete security and privacy checks**
  - **Implement:** Review CSRF/CORS, secure cookies, token rotation, XSS/output escaping, safe query construction, upload validation, secrets and redacted monitoring.
  - **Why:** A correct happy path does not prove the system is safe.
  - **Complete when:** The recorded negative security suite passes without leaking sensitive test data.

- [ ] **Step 138 — Complete critical concurrency and fault tests**
  - **Implement:** Race last-unit purchases, coupon quota, refunds, return quantity and POS uploads. Kill API/worker after commits but before responses/acknowledgements.
  - **Why:** Partial failures are the main risk in money and stock systems.
  - **Complete when:** Durable counts, balances and provider identities still represent one valid business result after replay.

- [ ] **Step 139 — Run k6 and Mongo query optimization**
  - **Implement:** Use an isolated representative dataset with 5,000 styles and realistic variants. Measure latency/errors, explain plans, connection waits and cache behavior.
  - **Why:** Performance targets need repeatable evidence rather than guesses.
  - **Complete when:** The documented environment meets agreed targets without overselling or cross-scope leaks.

- [ ] **Step 140 — Optimize frontend and accessibility**
  - **Implement:** Profile bundle/render costs, query invalidation, images and list behavior; verify keyboard focus, readable errors and small-screen POS/forms.
  - **Why:** A responsive API can still produce an unusable interface.
  - **Complete when:** Primary shopping and cashier tasks work with keyboard/mobile layouts and no private cache leakage.

- [ ] **Step 141 — Finish CI regression gates**
  - **Implement:** Run reviewed frozen installs, lint, type-check, unit/integration/E2E checks, contract checks and image builds in GitHub Actions.
  - **Why:** A later change must not silently break a completed workflow.
  - **Complete when:** A deliberately failing regression prevents the pipeline from promoting a release artifact.

## Deployment and project delivery

- [ ] **Step 142 — Prepare production images**
  - **Implement:** Create multi-stage non-root images for web/API/worker with compiled shared packages, a frozen lockfile and no baked-in secrets.
  - **Why:** Builds must be reproducible and process versions compatible.
  - **Complete when:** The images start from clean artifacts without developer node_modules or local files.

- [ ] **Step 143 — Configure Nginx TLS and production networking**
  - **Implement:** Route web/API/socket paths, configure upgrade headers, bounded timeouts/body sizes and approved proxy trust; keep Mongo/Redis private.
  - **Why:** The deployment needs one controlled public entry point.
  - **Complete when:** HTTPS, secure cookies, raw webhook verification and socket reconnect work through the real proxy.

- [ ] **Step 144 — Prepare database migrations and rollout**
  - **Implement:** Apply validators/critical indexes before dependent code; use backward-compatible changes and keep API/worker domain versions aligned. Document rollback boundaries.
  - **Why:** Rolling back an image cannot undo an incompatible data mutation.
  - **Complete when:** Staging can upgrade and recover without dropping critical indexes or orphaning active work.

- [ ] **Step 145 — Configure secrets logs metrics and alerts**
  - **Implement:** Use separate staging/production provider accounts and secrets; wire Pino/Sentry with redaction. Alert on error rates, queue lag, outbox age and payment/stock mismatches.
  - **Why:** A deployed service needs actionable visibility.
  - **Complete when:** A simulated dependency failure triggers an owner/runbook alert without exposing credentials.

- [ ] **Step 146 — Build and rehearse backups and restoration**
  - **Implement:** Encrypt off-host backups with a consistent snapshot/oplog strategy; restore to an isolated replica set and verify indexes/data. Reconcile provider captures after restore.
  - **Why:** A backup is useful only when recovery has been proven.
  - **Complete when:** Record measured restore time and recoverable data loss against approved RTO/RPO targets.

- [ ] **Step 147 — Deploy staging and run acceptance flows**
  - **Implement:** Deploy the same candidate images and realistic data; test online purchase, refund, partial shipment, stock transfer/count and online/offline POS recovery.
  - **Why:** The production topology can reveal failures that local tests miss.
  - **Complete when:** All acceptance flows pass through TLS/proxy/jobs with provider sandbox evidence.

- [ ] **Step 148 — Prepare the handover documentation**
  - **Implement:** Write installation/environment steps, OpenAPI, migration/deploy/rollback instructions, backup/recovery and incident runbooks. Include test results and known limitations.
  - **Why:** The project must remain understandable after the final development session.
  - **Complete when:** A reader can start, deploy, observe and recover the system using the repository documentation.

- [ ] **Step 149 — Deliver and record the release decision**
  - **Implement:** Review the production-readiness checklist, unresolved policies and all critical test evidence; promote the verified artifact and run a production-safe smoke check.
  - **Why:** Delivery means a tested operable release, not only a working local screen.
  - **Complete when:** Record version, release evidence, monitoring ownership and remaining limitations; complete tracker tasks only when their behavior is proven.

