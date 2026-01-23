# GitHub Copilot / Agent Instructions for GeofisicaHub ✅

Purpose: short, actionable orientation for AI coding agents to be immediately productive in this repository.

## Big picture (what this app is)

- React + TypeScript single-page app built with Vite; content site for geophysics resources (books, calculators, posts).
- Core runtime pieces:
  - `src/App.tsx` - top-level layout (Navbar / Footer / routes)
  - `src/AppRoutes.tsx` - route declarations (lazy-loaded pages)
  - `src/pages/*` - route-level pages (MDX posts live under `src/pages/posts/*`)
  - `src/components/*` - reusable UI components (MDX renderer, PDF viewer, book cards, forms)
- Appwrite is used for PDF storage and book metadata (see `src/services/appwrite.ts` and `APPWRITE_SETUP.md`).

## Key workflows & commands (run these locally)

- Development: `npm run dev` (Vite dev server)
- Build: `npm run build` (runs `tsc -b` then `vite build`)
- Lint: `npm run lint` (ESLint using `eslint.config.js` and TypeScript rules)
- Preview production build: `npm run preview`
- Appwrite tests & migrations:
  - Verify Appwrite access: `node test_appwrite.js` (or run `ts-node test_appwrite.ts`)
  - Migrate legacy `src/assets/books.json` to Appwrite: `python migrate_to_appwrite.py`
  - Upload local PDFs script (Node/TS): `npx ts-node src/services/upload_pdfs.ts`

## Environment variables & secrets

- App uses Vite `import.meta.env` vars with `VITE_` prefix. Required keys (see `APPWRITE_SETUP.md`):
  - `VITE_APPWRITE_ENDPOINT`, `VITE_APPWRITE_PROJECT_ID`, `VITE_APPWRITE_BUCKET_ID`, `VITE_APPWRITE_DATABASE_ID`, `VITE_APPWRITE_COLLECTION_ID`
- Never commit `.env` or API keys. Use `.env` and refer to `APPWRITE_SETUP.md` for steps.

## Content patterns & conventions (MDX, posts, i18n)

- Posts are MDX files per-language at `src/pages/posts/{en,pt,es,fr,it,de}/*.mdx`.
  - Frontmatter schema (found in `EachPost.tsx` -> `PostMeta`): `title`, `description`, `slug`, `tags`, `posted`, `updated`, `references`, `draft`.
  - Important: `slug` must be unique; files with `draft: true` are filtered out by `getAllPosts`.
- Import pattern: `import.meta.glob('./posts/en/*.mdx', { eager: true })` — list pages via glob, then lazy-wrap actual component for rendering.
- MDX config: `vite.config.ts` uses `@mdx-js/rollup` plus `remark-frontmatter` and `remark-mdx-frontmatter` to extract frontmatter.
- i18n: translations under `src/locales/*/translation.json`. Language is persisted to `localStorage('language')` in `src/i18n.ts`.

## Routing & sitemap

- Routes live in `src/AppRoutes.tsx` and are lazy loaded for performance. When adding routes/pages:
  1. Add route to `AppRoutes.tsx`.
  2. Add the route string to the `routes` array in `vite.config.ts` so sitemap generation remains accurate (Sitemap is generated at build time).

## Appwrite specifics & scripts

- Official client config: `src/services/appwrite.ts` (wrapped exports: `storage`, `tableDB`, `tablesDB`, `account`). Use these exports rather than creating a new Client instance.
- Helpful scripts:
  - `migrate_to_appwrite.py` — migrates `src/assets/books.json` to Appwrite storage (uses AppWrite REST API & server API key).
  - `src/services/upload_pdfs.ts` — Node script for bulk local uploads using `node-appwrite` (+ `ts-node`).
  - `test_appwrite.ts` — sample script to check storage/database access and download a document sample.
- Permissions: PDFs should be public-read; metadata in DB is optional but used by the UI. See `APPWRITE_SETUP.md` for required bucket/database fields.

## Build & performance notes

- Vite build uses `manualChunks` in `vite.config.ts` — chunk names and listed modules are intentional (vendor, ui, mdx, i18n, components, pages). If you move components around, update manualChunks accordingly.
- Chunk size warning limit is increased to 1000kb. Keep large libs split when possible.

## Styling & accessibility

- Tailwind CSS is configured in `tailwind.config.js`. Dark mode is class-based (`darkMode: 'class'`).

## Coding & repository conventions

- TypeScript strict settings are enabled (`tsconfig.app.json`): follow strict typing, avoid `any` unless necessary.
- ESLint config is in `eslint.config.js` — it extends TypeScript + React hooks rules. Run `npm run lint` before PRs.
- Use `import.meta.env` for env variables inside front-end code and `process.env` for Node scripts.

## Where to look for common tasks (quick references)

- Add a new MDX post: `src/pages/posts/en/new-post.mdx` (include `slug`, `title`, `description` frontmatter)
- Add a new book entry (legacy): `src/assets/books.json` — prefer Appwrite migration instead
- Add a new language: add `{lang}/translation.json` under `src/locales` and add language key to `i18n.ts` imports
- Debug AppWrite issues: `test_appwrite.ts`, `APPWRITE_SETUP.md` and checking env variables

## Do / Don't (brief)

- ✅ Do use `getAllPosts` / `loadPostsForLanguage` helpers to consume MDX posts
- ✅ Do update `vite.config.ts` `routes` array when adding public routes
- ✅ Do check AppWrite env vars and run `test_appwrite.ts` if uploads fail
- ❌ Don't commit API keys or `.env` files
- ❌ Don't assume posts are auto-indexed — ensure frontmatter includes `slug` and not `draft`

---

If anything above is unclear or you'd like specific examples added (e.g., a template MDX post with frontmatter, example `.env.example` snippet, or a quick checklist for PR reviewers), tell me which sections to expand and I will iterate.

_Generated by GitHub Copilot assistant — request edits if you want more/less detail._
