# design-sync notes

- **This is an app, not a published package.** The DS surface is `src/design-system.ts` (barrel). `npm run build:ds` (cfg.buildCmd) emits declarations to `build/ts/` (package.json `types` points there; the converter reads component names/props from it) and the compiled Tailwind stylesheet + Geist font files to `build/ds/`. Always run it before the converter — a stale `build/ts` means stale `.d.ts` contracts.
- Converter runs with `cfg.entry = src/design-system.ts` (esbuild bundles TS source directly) and `--node-modules ./node_modules`. Global: `window.SudokuSolverUI`.
- **Tailwind is static in the bundle.** Only classes found in `src/`, `.design-sync/previews/`, or the `@source inline(...)` safelist in `src/design-system.css` exist in `_ds_bundle.css`. A preview using a class outside those renders unstyled; extend the safelist if the design agent needs more vocabulary.
- Card/Kbd sub-parts (`CardHeader`… `KbdGroup`) are excluded from cards via `componentSrcMap: null` but stay exported in the bundle; they're shown inside the Card/Kbd previews.
- Primitives regroup via `docsMap` → `.design-sync/docs/primitives.md` (category stub). Sudoku components group from their `src/components/sudoku/` folder.
- Outline/ghost `Button`s inherit text color. Dark subtrees need `dark bg-background text-foreground`; NumberPad and ThemeToggle set `text-foreground` themselves (fixed after RowDark rendered invisible digits).
- Button, Card, NumberPad, SudokuBoard use `cardMode: "column"` (stories wider than grid cells).
- The web-app folder is its own git repo (nested inside sudoku-solver-app, whose root repo shows `web-app/` untracked).
- Run 1 (2026-10-18): user chose **local only, no upload**. No claude.ai/design project exists yet; `projectId` is unset. Note the user's Claude Design *canvas* "Sudoku Solver UI" (claude.ai/artifact/SSSQ6Bp4PF5uueaaxwpqon) is the source mockup this app was built from — it is NOT a design-system project and can't be a sync target.

## Known render warns

- `ThemeProvider` ships the floor card by design (it renders only its children).

## Re-sync risks

- Playwright pinned to 1.63.0 in `.ds-sync/` to match cached chromium-1243; a different cache needs a different pin.
- Fonts come from `@fontsource-variable/geist` + `geist-mono`, copied by `build:ds`; a package bump that renames files would surface as `[FONT_DANGLING]`.
- The `@source inline` safelist is hand-maintained: conventions.md promises those families, so keep the two in sync.
- First upload will have no anchor → full verification; grades in `.cache/` are local only until an upload.
