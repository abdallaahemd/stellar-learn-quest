## Goal

Mirror your existing Vite + React Router iSchool app inside this TanStack Start project, preserving structure, logic, and assessment flow. Visual upgrades come AFTER the base migration is stable.

## Phase 1 — Scaffold (this turn's implementation)

Set up the foundation so each file you send has a clear destination.

1. **Install dependencies** likely needed by the original app:
   - `framer-motion` (animations, used later)
   - `lucide-react` (already common with shadcn — verify)
   - `clsx`, `tailwind-merge` (already present via `cn`)
   - Defer: react-router-dom (replaced by TanStack Router), zustand/jotai/redux (only if you use them — tell me)

2. **Folder structure** mirroring a typical Vite app, adapted to TanStack:
   ```
   src/
     routes/              # TanStack file-based routes (replaces react-router)
       __root.tsx         # global layout (Header/Footer wrapper)
       index.tsx          # Home/Landing
       [one file per original page]
     components/          # 1:1 port of original src/components
       layout/            # Header, Footer, Navbar
       ui/                # shadcn (already here)
       [feature folders mirroring original]
     pages/               # ⚠️ NOT used — content moves into src/routes/
     features/            # if original uses feature-based org, mirror it
     hooks/               # 1:1 port
     lib/                 # 1:1 port (utils, helpers)
     data/                # quiz/grade/module static data — 1:1 port
     types/               # TS types — 1:1 port
     assets/              # logo + images — 1:1 port
     styles/              # any extra css beyond styles.css
   ```

3. **Routing translation rules** (what changes during port):
   - `react-router-dom` → `@tanstack/react-router`
   - `<BrowserRouter>` / `<Routes>` / `<Route>` → file-based routes in `src/routes/`
   - `<Link to="/x">` → same API, import from `@tanstack/react-router`
   - `useNavigate()` → same name, import from `@tanstack/react-router`
   - `useParams()` → `Route.useParams()` in each route file
   - `useLocation()` → same name, from `@tanstack/react-router`
   - Dynamic segments `:id` → `$id` in filename (e.g. `quiz.$grade.$module.tsx`)
   - Nested routes with `<Outlet />` → layout route files (e.g. `quiz.tsx` parent + `quiz.$id.tsx` child)
   - `index.html` `<head>` content → `head()` in `__root.tsx` and per-route

4. **Logo replacement**:
   - Copy your uploaded logo to `src/assets/ischool-logo.png`
   - Wire it into the Header component once that's ported

5. **Tailwind/styles**:
   - This project uses Tailwind v4 via `src/styles.css` (no `tailwind.config.js`)
   - Original `tailwind.config.js` theme tokens → ported into `src/styles.css` as CSS variables under `:root` / `.dark` and registered in `@theme inline`
   - Original `index.css` global styles → merged into `src/styles.css`

6. **Placeholder home**: Replace the blank-page placeholder in `src/routes/index.tsx` with a minimal "iSchool — migration in progress" screen using the new logo, so the preview isn't broken while files arrive.

## Phase 2 — Progressive migration (per file you send)

For each batch you send, I'll:
1. Detect file type (page / component / hook / data / asset).
2. Place it in the mirrored folder.
3. Apply only the mechanical translations above (router imports, params).
4. Keep all logic, state, conditionals, and assessment math byte-identical.
5. Keep original class names; do NOT restyle yet.
6. After each batch, confirm preview still builds before moving on.

## Phase 3 — Visual upgrade (only after migration complete)

Once all pages render correctly with original behavior:
- Add Framer Motion (page transitions, stagger, hover)
- Cinematic hero, glassmorphism cards, glow gradients
- Quiz feedback animations (success glow, shake)
- Result screen (animated score ring, confetti)
- Dark mode polish
- Done in small PR-sized passes, never touching assessment logic

## Technical notes

- **Server functions / SSR**: TanStack Start SSRs by default. If any original component uses `window`, `localStorage`, or `document` at module scope, I'll wrap with `<ClientOnly>` or move into `useEffect`. Tell me if you use localStorage for quiz state — I'll handle hydration carefully.
- **Data fetching**: If the original is purely client-side static data (JSON in `src/data/`), no changes needed. If it hits an API, I'll convert to `createServerFn` only if secrets are involved; otherwise leave as fetch.
- **No backend yet**: I won't enable Lovable Cloud unless you ask or your code requires it (auth, DB).

## What I need from you next

After approving this plan, send the first batch. Helpful order:
1. `package.json` (so I can match deps)
2. `tailwind.config.js` + `index.css` (so I can port theme tokens)
3. `src/App.jsx` or wherever `<Routes>` lives (so I know the full route map up-front)
4. Then components/pages in any order

## Out of scope for Phase 1

- No visual redesign yet
- No Framer Motion yet
- No new features
- No changes to assessment logic
