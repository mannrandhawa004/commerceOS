<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## CommerceOS frontend design language (project rule)

Use the editorial-minimal, high-contrast style demonstrated by `src/components/ui/auth-section-1.tsx` for all new frontend work.

- **Styling:** Tailwind CSS v4 utility classes for component styling. `src/app/globals.css` is reserved for the Tailwind import, design tokens and legacy primitives. Add small additive rules in `src/shared/styles/utilities.css` only when a utility class cannot express the need.
- **Structure:** shadcn defaults from `components.json`. Components live in `src/components/ui` and are imported as `@/components/ui/<name>`. Helpers live in `src/lib/utils.ts` (`cn` = clsx + tailwind-merge); hooks in `src/hooks`.
- **Auth pages:** `/login` and `/register` use `src/components/ui/auth-shell.tsx`, `auth-form-layout.tsx`, `form-field.tsx`, `form-alert.tsx`, and `submit-button.tsx`. Reuse these rather than reintroducing the legacy CSS auth classes.
- **Visual direction:** white / near-black surfaces (`bg-white`, `dark:bg-[#050505]`), generous whitespace, thin `border-black/20` / `dark:border-white/10` separators, `rounded-md` or `rounded-[10px]`, muted text through opacity (`text-black/60`, `dark:text-white/55`), tight negative tracking on headings, medium font weights.
- **Layout:** asymmetric or split grids on large screens (e.g. `lg:grid-cols-[0.94fr_1.06fr]`), stacked on mobile. Always provide `sm:`, `lg:`, `xl:` breakpoints and a `dark:` variant.
- **Sizing:** keep controls compact at laptop widths (1366–1440px) — roughly the feel of browser zoom at 75%. Use smaller `h-12` fields, `text-base` input text, `text-2xl`/`38px` headings and tighter margins for `lg`/`xl`; reserve the larger `h-14`, `text-lg`, `50px` heading scale for `2xl` wide displays.
- **Motion and effects:** subtle `transition-colors` only. Decorative shader panels may use `@paper-design/shaders-react` (`GrainGradient`); never put content-critical text on top of a shader without contrast handling.
- **Icons:** use `lucide-react` for generic/UI icons. Inline SVG is acceptable only for brand marks lucide does not ship (Google, Apple, Windows).
- **Avoid:** heavy shadows, gradient text, pill-sized radii, emojis as icons, and hardcoded hex colors when a Tailwind opacity/token utility exists.
- **Adding primitives:** `pnpm dlx shadcn@latest add <component>` and keep generated files in `src/components/ui`.
