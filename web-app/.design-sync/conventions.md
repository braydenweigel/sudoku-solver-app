# Sudoku Solver UI — conventions

shadcn/ui (Base UI, "base-nova" style) on Tailwind v4, zinc neutrals with a blue `#2563eb` primary, Geist / Geist Mono type. Components live on `window.SudokuSolverUI`.

## Setup and theming

- Wrap the app once in `<ThemeProvider defaultTheme="light">`. It adds the `light`/`dark` class to `<html>` (persisted; pressing "d" toggles) and is required by `ThemeToggle` (`useTheme` throws outside it).
- Dark mode is purely the `.dark` class: every token is redefined under `.dark`, so any subtree can be forced dark with `className="dark bg-background text-foreground"`. Always set `text-foreground` on a page or dark root — outline/ghost buttons inherit text color, and without it their labels go invisible on dark surfaces.
- Page root: `min-h-svh bg-background text-foreground antialiased`. Font is applied via `font-sans` (Geist); use `font-mono` for keys/codes.

## Styling idiom: Tailwind utilities over semantic tokens

Never hard-code hex colors; use the token utilities (all defined in `styles.css` → `_ds_bundle.css`):

| Family | Classes |
|---|---|
| Surfaces | `bg-background` (page), `bg-card`, `bg-muted`, `bg-secondary`, `bg-primary` |
| Text | `text-foreground`, `text-muted-foreground`, `text-primary`, `text-primary-foreground`, `text-destructive`, `text-solver` (solver-filled digits) |
| Sudoku | `bg-cell`, `bg-cell-peer`, `bg-cell-selected`, `bg-destructive-soft`, `bg-grid-line`, `border-grid-box` |
| Lines/shape | `border` (uses `border-border`), `rounded-lg` (controls), `rounded-xl` (cards), `shadow-xs`, `ring-1 ring-foreground/10` |
| Layout | `flex`/`grid`, `gap-{1..12}`, `p-{0..16}`, `max-w-{sm..7xl}`, `grid-cols-{1..12}`, with `md:` variants |

Only utilities present in the compiled CSS work (the build is static): the families above, standard spacing/typography (`text-{xs..5xl}`, `font-{medium,semibold,bold}`, `tracking-tight`, `tabular-nums`) and their `md:` variants. Prefer these over arbitrary values like `w-[437px]`.

Headings: page `text-3xl font-bold tracking-tight`; section `text-base font-semibold`; supporting copy `text-sm text-muted-foreground`.

## Components

- Primitives: `Button` (variants `default | outline | secondary | ghost | destructive | link`; sizes `xs | sm | default | lg | icon | icon-sm | icon-lg`; put lucide icons inside with `data-icon="inline-start"`), `Badge`, `Card` + `CardHeader`/`CardTitle`/`CardDescription`/`CardAction`/`CardContent`/`CardFooter`, `Kbd`/`KbdGroup`, `ThemeToggle`.
- Sudoku: `SudokuBoard` (controlled: `values` 81 numbers, 0 = empty; `origins`; `selected`; `onSelect`; `onInput`), `NumberPad` (`layout="grid"` desktop / `"row"` phone), `BoardStatus`, `SolverStatus`, `BoardLegend`.
- Logic helpers (same global): `parseGrid`, `EXAMPLE_PUZZLE`, `originsFor`, `emptyGrid`, `findClashes`, `solvePuzzle`, `revealOne` — use them to make boards real instead of hand-typing 81 digits.

Each component's `.d.ts` is its API contract and `.prompt.md` its usage; read them before composing.

## Example

```tsx
const { ThemeProvider, Card, CardHeader, CardTitle, CardDescription, CardContent,
  Button, SudokuBoard, BoardStatus, parseGrid, originsFor, EXAMPLE_PUZZLE } = window.SudokuSolverUI

function Screen() {
  const [values] = React.useState(() => parseGrid(EXAMPLE_PUZZLE))
  const [selected, setSelected] = React.useState(40)
  return (
    <ThemeProvider defaultTheme="light">
      <main className="min-h-svh bg-background text-foreground mx-auto max-w-5xl p-6 flex flex-col gap-6 md:flex-row">
        <Card className="flex-1 shadow-xs">
          <CardHeader>
            <CardTitle className="font-semibold">Your puzzle</CardTitle>
            <CardDescription>Click a square, then type 1–9.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <BoardStatus filled={values.filter(Boolean).length} />
            <SudokuBoard values={values} origins={originsFor(values)} selected={selected} onSelect={setSelected} />
            <Button className="h-10">Solve puzzle</Button>
          </CardContent>
        </Card>
      </main>
    </ThemeProvider>
  )
}
```
