# CommerceOS

CommerceOS is organized into two top-level applications:

- `client/` — Next.js frontend starter.
- `server/` — backend workspace containing the Express API, worker placeholder, shared packages, infrastructure, scripts, and documentation.

## Start the API

Requirements: Node.js and pnpm.

```powershell
cd server
Copy-Item .env.example .env
pnpm install
pnpm dev
```

The starter health endpoint is `http://localhost:5000/api/v1/health`. Open the interactive Swagger documentation at `http://localhost:5000/api/v1/docs/` while the server is running; see [API documentation](server/apps/api/README.md) for usage.

Track the guide's backend and frontend work in [docs/README.md](docs/README.md).

## Backend feature checklist

Based on `CommerceOS_Complete_Implementation_Guide.docx`. Check an item when its backend functionality and relevant guide acceptance criteria are verified. Some foundation components already exist; see the [detailed tracker](docs/README.md) for partial progress and test evidence. Step numbers refer to the guide.

### Foundation and data

- [ ] Define release scope, business policies and development conventions (001–004).
- [ ] Organize backend modules, app shells, shared contracts and configuration (005, 007–010).
- [ ] Set up local MongoDB replica set, Redis and project documentation (011–012).
- [ ] Design collection relationships, common fields and indexes (013–014, 021–022).
- [ ] Design catalogue, pricing, inventory, customer, order, payment, POS and fulfillment records (015–020).
- [ ] Implement identity, location, catalogue and pricing schemas (023–024).
- [ ] Implement customer, sales, inventory, POS, fulfillment and infrastructure schemas (025–027).
- [ ] Add request, business and reference validation (028–029).
- [ ] Add database validators, index migrations and schema contract tests (030–031).
- [ ] Complete MongoDB lifecycle, middleware, liveness and readiness checks (032–034).
- [ ] Complete error handling, request logging, security and rate limiting (035–038).
- [ ] Document API conventions and OpenAPI; set up the backend test harness (039–040).

### Authentication and access

- [ ] Add owner bootstrap, customer registration and login (041–043).
- [ ] Add access-token validation, refresh rotation and logout (044–046).
- [ ] Add current-user and session APIs, password reset/change and authentication audit events (047–049).
- [ ] Add permissions, roles and resource authorization policies (052–053).
- [ ] Add organization, store, warehouse, register and employee assignment APIs (054–056).

### Catalogue and pricing

- [ ] Add brand, category, attribute and size-chart APIs (058–060).
- [ ] Add product creation, detail, updates and variant APIs (061–063).
- [ ] Add media upload, publishing and archiving (064–065).
- [ ] Add product listing, search and filters; verify indexes and query plans (066–067).
- [ ] Add product import and export (068).
- [ ] Add price lists, variant price editing and pricing quotes (070–072).
- [ ] Add promotions and coupons (073).

### Inventory and customers

- [ ] Add stock balance and availability reads, receiving and adjustments (075–077).
- [ ] Add reservations, release and expiry, and partial stock consumption (078–080).
- [ ] Add inventory history and reconciliation (081).
- [ ] Add customer profiles, addresses, account and wishlist backend functionality (083, 087).
- [ ] Add verified reviews and moderation backend functionality (088).
- [ ] Add stock transfer creation, approval, dispatch and partial receipt (106–107).
- [ ] Add stock counts and low-stock alerts (108–109).

### Cart, orders and payments

- [ ] Add persistent carts, guest cart merge and checkout quotes (090–091, 093).
- [ ] Add command idempotency and order creation (094–095).
- [ ] Add order history, admin listing, transitions and cancellation (096–097).
- [ ] Define the payment provider contract and add payment attempts (098–099).
- [ ] Verify signed webhooks and process payment events (101–102).
- [ ] Add payment reconciliation, failure recovery and refunds (103–104).

### POS and fulfillment

- [ ] Add POS sign-in, register opening, scanner lookup and cart support (110–111).
- [ ] Add POS sales, split tenders, receipts, cash movements and register reconciliation (112–114).
- [ ] Support catalogue snapshot/delta sync and device stock allowances for offline POS (118–119).
- [ ] Add idempotent server synchronization for offline sales (121).
- [ ] Add shipping methods and quotes, shipment creation and handoff (123–124).
- [ ] Ingest and deduplicate shipment tracking events (125).
- [ ] Add return requests, approvals, receiving and inspection (126–127).
- [ ] Connect returns to refunds and exchanges (128).

### Operations, reporting and delivery

- [ ] Add a transactional outbox and retry-safe background workers (129–130).
- [ ] Add notifications, scheduling, failed-job recovery and authorized real-time updates (131–132).
- [ ] Add sales, inventory, margin and POS reports and scoped export jobs (133–135).
- [ ] Verify access controls, security, privacy, concurrency and fault recovery (136–138).
- [ ] Run load tests and optimize MongoDB queries (139).
- [ ] Add CI regression gates and production images (141–142).
- [ ] Configure TLS, proxy networking, migrations and rollout (143–144).
- [ ] Configure secrets, logs, metrics, alerts, backups and restore procedures (145–146).
- [ ] Verify staging acceptance flows and prepare handover and release evidence (147–149).

## Push to GitHub

Create an empty repository on GitHub, then from the project root:

```powershell
git add .
git commit -m "Initial CommerceOS backend setup"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```
