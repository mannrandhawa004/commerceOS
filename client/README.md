# CommerceOS frontend

Production-oriented Next.js 16 (App Router) client for CommerceOS. Authentication uses a
backend-for-frontend (BFF): the browser only talks to same-origin route handlers, and session
tokens are stored in HttpOnly cookies by the Next.js server.

## Getting started

1. Configure and run the Express API as described in the root README. From `server/`, run
   `pnpm --filter @commerce-os/api seed:roles` to seed the customer role before registering.
2. Copy `.env.example` to `.env.local`. Set `COMMERCE_API_URL` if the API is not on
   `http://localhost:5000/api/v1`. The Next.js server must be able to reach this URL.
3. Run `pnpm install` then `pnpm dev` in `client/`, and open http://localhost:3000.
4. Before shipping: `pnpm typecheck`, `pnpm lint`, `pnpm build`.

Use HTTPS in production — cookies are marked `secure` when `NODE_ENV=production`.

## Architecture

The frontend mirrors the backend's layered, feature-module style.

```
src/
├── app/                         # Next.js routes only (thin pages + route handlers)
│   ├── (auth)/                  # login / register (shared AuthShell)
│   ├── api/auth/[action]/       # thin BFF transport -> auth controller
│   ├── dashboard/               # protected area (layout guard + client page)
│   ├── error.tsx                # global error boundary
│   ├── loading.tsx
│   └── not-found.tsx
├── components/ui/               # shadcn components (import as @/components/ui/*)
├── config/                      # validated env + app-wide constants
├── lib/                         # shadcn helpers (cn via clsx + tailwind-merge)
├── proxy.ts                     # cheap cookie-presence guard for /dashboard
├── modules/                     # feature slices (one folder per domain)
│   └── auth/
│       ├── components/          # feature UI
│       ├── constants/
│       ├── controllers/         # BFF orchestration for route handlers
│       ├── hooks/               # useAuth()
│       ├── services/            # axios clients: browser -> BFF, BFF -> Express
│       ├── slices/              # Redux Toolkit createSlice
│       ├── thunks/              # createAsyncThunk (async side effects)
│       ├── types/               # domain types
│       └── validators/          # Zod schemas
├── shared/                      # cross-cutting, feature-agnostic code
│   ├── api/                     # axios instances + envelope/error mapping
│   ├── components/{ui,layout}/  # reusable Button, InputField, shells, Brand, ...
│   ├── errors/                  # AppError, error codes, normalisation
│   ├── hooks/                   # reusable useZodForm
│   ├── providers/               # AppProviders / StoreProvider
│   ├── response/                # success/error envelope helpers for BFF
│   ├── styles/                  # additive CSS on top of globals.css
│   └── types/                   # API envelope types
└── store/                       # configureStore, root reducer, typed hooks
```

### Data flow

```
Component -> useAuth() -> thunk -> authClient (axios, /api/*) -> BFF route handler
          -> auth controller -> authServer (axios, COMMERCE_API_URL) -> Express API
```

- **Validation:** Zod schemas in `modules/<feature>/validators` run both in the form
  (`useZodForm`) and again in the BFF controller. The Express API remains the source of truth.
- **State:** Redux Toolkit. Slices hold state, thunks own async calls, typed hooks in
  `store/hooks.ts` are the only way components touch the store.
- **Errors:** non-2xx envelopes are converted to `AppError` by the axios interceptor; thunks
  store a safe message as `rejectValue`; forms surface it through `Alert`.
- **Styling:** Tailwind CSS v4 utilities (imported in `app/globals.css`) layered over the legacy
  design-system CSS; additive rules live in `shared/styles/utilities.css`.

## Styling and UI primitives (shadcn + Tailwind)

- `components.json` defines the shadcn defaults: `src/components/ui` for components,
  `src/lib/utils.ts` for `cn`, and `src/app/globals.css` for Tailwind v4 CSS.
- Add a primitive with `pnpm dlx shadcn@latest add <name>`; generated files land in
  `src/components/ui`. The `@/components/ui` alias is why this folder must exist: shadcn's
  generated imports and registry updates assume it.
- Use `lucide-react` for UI icons; keep inline SVG only for brand marks (Google/Apple/Windows).
- See `AGENTS.md` for the required visual direction (editorial minimal, high contrast,
  responsive + dark variants, subtle motion).
- `src/components/ui/auth-section-1.tsx` is the reference implementation; preview it at
  **http://localhost:3000/demo** via `src/app/demo/page.tsx`.

## Adding a feature

1. Create `src/modules/<feature>/` with `components`, `controllers`, `hooks`, `services`,
   `slices`, `thunks`, `types` and `validators` as needed.
2. Add a Zod validator mirroring the backend schema and reuse `useZodForm`.
3. Add an axios service that calls the BFF through `getApiResponse`; never call the Express API
   from a client component.
4. Add a slice + thunks and register the reducer in `src/store/root-reducer.ts`.
5. Keep route files under `src/app/` thin — delegate to a controller.
6. Add new shared primitives to `src/shared/components/ui` instead of duplicating markup.
