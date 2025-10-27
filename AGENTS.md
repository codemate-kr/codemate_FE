# Repository Guidelines

## Project Structure & Module Organization
- `src/` — app code.
  - `api/` (Axios clients), `components/`, `pages/` (route views), `store/` (Zustand), `hooks/`, `utils/`, `types/`, `config/`.
- `public/` — static assets served as-is.
- `dist/` — build output (ignored).
- Root configs: `vite.config.ts`, `eslint.config.js`, `tailwind.config.js`, `tsconfig*.json`, `.env*`.

## Build, Test, and Development Commands
- `npm run dev` — start Vite dev server with HMR.
- `npm run build` — type-check (`tsc -b`) and build for production.
- `npm run preview` — serve the production build locally.
- `npm run lint` — run ESLint on the project.
- Tests: no runner is configured yet. If adding tests, prefer Vitest + React Testing Library and add a `test` script.

## Coding Style & Naming Conventions
- Language: TypeScript, React 19, Vite 7, Tailwind CSS.
- Linting: ESLint (JS/TS recommended, React Hooks latest, Vite refresh). Fix issues before PR.
- Indentation: 2 spaces; use TypeScript types/interfaces; keep modules small and cohesive.
- Naming:
  - Components: PascalCase, file `ComponentName.tsx`.
  - Hooks: `useThing.ts` returning typed values.
  - Zustand stores: `SomethingStore.ts` with selectors exported.
  - Pages: `src/pages/<route>/<Name>Page.tsx`.
  - Utilities: `verbNoun.ts` (e.g., `formatDate.ts`).

## Testing Guidelines
- Until a test runner is added, focus on small, testable functions in `utils/` and logic within hooks/stores.
- When introducing tests: co-locate as `*.test.ts(x)` near sources or under `src/__tests__/` with the same folder structure; mock network with MSW.

## Commit & Pull Request Guidelines
- Commits follow short prefixes seen in history: `feat`, `fix`, `chore`, `UIUX`, `page` (e.g., `feat : 멤버초대 모달 구현`). Keep messages concise and scoped.
- Branches: include issue id and scope, kebab-case (e.g., `6-feat-invite-modal`).
- PRs: include description, linked issues (`#123`), screenshots for UI changes, and a checklist for `lint`/build status. Note any `.env` changes.

## Security & Configuration Tips
- Never commit secrets. Copy `.env.example` to `.env` and keep the example updated when adding vars.
  - Example: `cp .env.example .env` then set `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`, etc.
- Deploy: Vercel uses `vercel.json`. Ensure environment variables are set in the platform before deploying.
