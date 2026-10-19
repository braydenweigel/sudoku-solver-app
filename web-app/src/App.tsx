import * as React from "react"
import {
  BookOpenIcon,
  Grid3x3Icon,
  LightbulbIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react"

import { BoardLegend } from "@/components/sudoku/board-legend"
import { BoardStatus } from "@/components/sudoku/board-status"
import { NumberPad } from "@/components/sudoku/number-pad"
import { SolverStatus } from "@/components/sudoku/solver-status"
import { SudokuBoard } from "@/components/sudoku/sudoku-board"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Kbd } from "@/components/ui/kbd"
import {
  EXAMPLE_PUZZLE,
  emptyGrid,
  findClashes,
  originsFor,
  parseGrid,
  revealOne,
  solvePuzzle,
  type CellOrigin,
  type Grid,
  type SolverMessage,
  type SolverResult,
} from "@/lib/sudoku"

type PuzzleState = {
  values: Grid
  origins: CellOrigin[]
  selected: number | null
  message: SolverMessage | null
}

function examplePuzzle(): PuzzleState {
  const values = parseGrid(EXAMPLE_PUZZLE)
  return { values, origins: originsFor(values), selected: 40, message: null }
}

export function App() {
  const [puzzle, setPuzzle] = React.useState<PuzzleState>(examplePuzzle)
  const { values, origins, selected, message } = puzzle

  const filled = values.filter(Boolean).length
  const clashes = React.useMemo(() => findClashes(values).length, [values])

  const select = (index: number) => setPuzzle((p) => ({ ...p, selected: index }))

  const setDigit = (digit: number) =>
    setPuzzle((p) => {
      if (p.selected === null) return p
      const nextValues = p.values.slice()
      const nextOrigins = p.origins.slice()
      nextValues[p.selected] = digit
      nextOrigins[p.selected] = digit ? "given" : null
      return { ...p, values: nextValues, origins: nextOrigins, message: null }
    })

  const run = (action: (values: Grid, origins: CellOrigin[]) => SolverResult) =>
    setPuzzle((p) => {
      const result = action(p.values, p.origins)
      return {
        values: result.values ?? p.values,
        origins: result.origins ?? p.origins,
        selected: result.selected ?? p.selected,
        message: result.message,
      }
    })

  const solve = () => run(solvePuzzle)
  const hint = () => run(revealOne)
  const clear = () =>
    setPuzzle((p) => {
      const empty = emptyGrid()
      return { ...p, values: empty, origins: originsFor(empty), message: null }
    })
  const loadExample = () => setPuzzle(examplePuzzle())

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground antialiased">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-15 max-w-280 items-center justify-between gap-4 pr-3 pl-4 md:h-16 md:px-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-7.5 items-center justify-center rounded-lg bg-primary text-primary-foreground md:size-8">
              <Grid3x3Icon className="size-4.25 md:size-4.5" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-[-0.01em] md:text-[15px]">
              Sudoku Solver
            </span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" onClick={loadExample} className="h-11 px-3 text-sm md:h-9">
              <BookOpenIcon data-icon="inline-start" className="hidden md:block" />
              <span className="md:hidden">Example</span>
              <span className="hidden md:inline">Load example</span>
            </Button>
            <ThemeToggle className="size-11 md:size-9" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-280 flex-1 flex-col gap-4 px-4 pt-5 pb-6 md:block md:flex-none md:px-6 md:pt-10 md:pb-14">
        <div className="mb-7 hidden md:block">
          <h1 className="text-3xl leading-tight font-bold tracking-tight">
            Solve any Sudoku Puzzle
          </h1>
          <p className="mt-2 max-w-145 text-[15px] leading-[1.55] text-muted-foreground">
            Type the digits from your puzzle into the grid, then solve the whole puzzle or reveal
            one square at a time.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 md:gap-6 lg:flex-row">
          <section className="flex min-w-0 flex-col gap-4 md:gap-5 md:rounded-xl md:border md:bg-card md:p-6 md:shadow-xs lg:flex-1">
            <div className="flex items-start justify-between gap-3 md:gap-4">
              <div className="min-w-0">
                <h2 className="text-xl leading-tight font-bold tracking-[-0.02em] md:text-base md:font-semibold md:tracking-[-0.01em]">
                  Your puzzle
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="md:hidden">Tap a square, then a number.</span>
                  <span className="hidden md:inline">
                    Click a square, then type 1–9. Leave unknown squares empty.
                  </span>
                </p>
              </div>
              <BoardStatus filled={filled} clashes={clashes} format="compact" className="md:hidden" />
              <div className="hidden shrink-0 items-center gap-2 md:flex">
                {/* Fixed width so the description wraps the same whatever the badge says. */}
                <span className="flex w-28 justify-end">
                  <BoardStatus filled={filled} clashes={clashes} />
                </span>
                <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
                  <RotateCcwIcon data-icon="inline-start" />
                  Clear board
                </Button>
              </div>
            </div>

            <SudokuBoard
              values={values}
              origins={origins}
              selected={selected}
              onSelect={select}
              onInput={setDigit}
              className="mx-auto max-w-135"
            />

            <BoardLegend className="hidden md:flex" />
          </section>

          {/* Tablet: two equal cards under the board. Desktop: a column stretched to the board card's height. */}
          <aside className="hidden min-w-0 gap-4 md:grid md:grid-cols-2 lg:flex lg:w-75 lg:flex-none lg:flex-col">
            <Card className="gap-4 shadow-xs [--card-spacing:--spacing(5)] lg:flex-1">
              <CardHeader>
                <CardTitle className="font-semibold tracking-[-0.01em]">Solve</CardTitle>
                <CardDescription>Answers go straight onto the board in blue.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Button onClick={solve} className="h-10 shadow-xs">
                    <SparklesIcon data-icon="inline-start" />
                    Solve puzzle
                  </Button>
                  <Button variant="outline" onClick={hint} className="h-10 bg-card shadow-xs dark:bg-card">
                    <LightbulbIcon data-icon="inline-start" />
                    Reveal one square
                  </Button>
                </div>
                {/* Fixed slot so a result message never changes the card's height. */}
                {message ? (
                  <SolverStatus tone={message.tone} className="min-h-21 flex-1">
                    {message.text}
                  </SolverStatus>
                ) : (
                  <p className="m-0 min-h-21 flex-1 rounded-lg border border-dashed px-3 py-2.5 text-[13px] leading-[1.45] text-muted-foreground">
                    Solve fills every empty square. Reveal places the square with the fewest
                    possible digits.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="gap-4 shadow-xs [--card-spacing:--spacing(5)]">
              <CardHeader>
                <CardTitle className="font-semibold tracking-[-0.01em]">Enter a digit</CardTitle>
                <CardDescription>Fills the selected square.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <NumberPad layout="grid" onDigit={setDigit} onErase={() => setDigit(0)} />
                <div className="flex flex-wrap gap-x-4 gap-y-3 text-[13px] text-muted-foreground">
                  <KeyHint keys="1–9" label="Place" />
                  <KeyHint keys="⌫" label="Erase" />
                  <KeyHint keys="← ↑ → ↓" label="Move" />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Phone: keypad under the board, actions pinned to the bottom. */}
          <div className="flex flex-1 flex-col gap-4 md:hidden">
            <NumberPad layout="row" onDigit={setDigit} onErase={() => setDigit(0)} />
            <div className="mt-auto flex flex-col gap-2">
              {message && (
                <SolverStatus tone={message.tone} className="text-center">
                  {message.text}
                </SolverStatus>
              )}
              <Button onClick={solve} className="h-12 rounded-[10px] text-[15px] shadow-xs [&_svg:not([class*='size-'])]:size-4.5">
                <SparklesIcon data-icon="inline-start" />
                Solve puzzle
              </Button>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <Button
                  variant="outline"
                  onClick={hint}
                  className="h-12 rounded-[10px] bg-card text-[15px] shadow-xs dark:bg-card [&_svg:not([class*='size-'])]:size-4.5"
                >
                  <LightbulbIcon data-icon="inline-start" />
                  Reveal one square
                </Button>
                <Button
                  variant="outline"
                  aria-label="Clear board"
                  onClick={clear}
                  className="size-12 rounded-[10px] bg-card text-muted-foreground shadow-xs dark:bg-card [&_svg:not([class*='size-'])]:size-4.5"
                >
                  <RotateCcwIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function KeyHint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Kbd className="h-5 rounded border border-b-2 bg-muted px-1.5 font-mono text-[11px] text-foreground">
        {keys}
      </Kbd>
      {label}
    </span>
  )
}

export default App
