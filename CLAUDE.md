# CLAUDE.md

## Project Overview

Career Change ROI Calculator — a client-side React + TypeScript app that projects the financial impact of switching careers. No backend. All state in-browser.

## Commands

- `npm run dev` — dev server on port 3000
- `npm run build` — TypeScript check + Vite production build
- `npm run test` — run all tests (Vitest)
- `npm run test:watch` — tests in watch mode
- `npm run lint` — ESLint

## Architecture

The app has a clear separation between calculation logic and UI:

- **`src/calculations/`** — Pure functions, no React dependencies. The projection engine (`projection.ts`) computes year-by-year "stay" vs "switch" scenarios. Loan amortization in `loan.ts`. Validation in `validation.ts`. All have unit tests in `__tests__/`.
- **`src/types/`** — TypeScript interfaces for inputs, results, and saved profiles.
- **`src/hooks/`** — `useCalculation` (memoized projection) and `useProfiles` (localStorage persistence).
- **`src/components/`** — React UI. `InputPanel` composes four input section components. `ResultsPanel` composes `SummaryCards` + `ProjectionChart`. `ProfileManager` handles save/load/delete.
- **`src/App.tsx`** — Wires everything together. State lives here via `useState<CalculatorInputs>`.

## Key Patterns

- Use `import type` for type-only imports (verbatimModuleSyntax is enabled).
- Calculation functions are pure and tested independently from UI.
- `InputPanel` uses functional state updates (`onChange(prev => ({ ...prev, slice }))`) to avoid stale closures.
- The `useCalculation` hook uses JSON-serialized inputs for stable memoization.
- Tailwind CSS v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed.
- Custom theme colors defined via `@theme` in `src/index.css`.

## Styling

Dark theme with editorial finance aesthetic. Color palette:
- Cyan/teal — primary accent, "Career Switch" line
- Slate — backgrounds, "Stay Put" line
- Emerald — positive ROI
- Red — negative ROI
- Amber — costs/warnings

Fonts: DM Serif Display (headings) + DM Sans (body), loaded via Google Fonts in `index.css`.

## Testing

31 tests across 5 files. Calculation tests use `// @vitest-environment node` to skip jsdom overhead. Run `npm test` before committing.

## Design Documents

- `docs/plans/2026-02-12-career-change-roi-design.md` — Original design
- `docs/plans/2026-02-12-career-change-roi-implementation.md` — Implementation plan
