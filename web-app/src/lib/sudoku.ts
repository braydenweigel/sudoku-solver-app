/** A board is 81 digits in row-major order; 0 means empty. */
export type Grid = number[]

/** Who placed a digit: the player ("given"), the solver ("solved"), or nobody. */
export type CellOrigin = "given" | "solved" | null

export type SolverMessage = { tone: "ok" | "error"; text: string }

export type SolverResult = {
  values?: Grid
  origins?: CellOrigin[]
  selected?: number
  message: SolverMessage
}

const API_URL = import.meta.env.VITE_API_URL

export const EXAMPLE_PUZZLE =
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079"

/** The minimum number of givens for a puzzle to have a unique solution. */
export const MIN_CLUES = 17

export function parseGrid(source: string): Grid {
  return source
    .slice(0, 81)
    .padEnd(81, "0")
    .split("")
    .map((ch) => (ch >= "1" && ch <= "9" ? Number(ch) : 0))
}

export function emptyGrid(): Grid {
  return new Array(81).fill(0)
}

export function originsFor(values: Grid): CellOrigin[] {
  return values.map((v) => (v ? "given" : null))
}

export const rowOf = (i: number) => Math.floor(i / 9)
export const colOf = (i: number) => i % 9
export const boxOf = (i: number) =>
  Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3)

/** Whether digit `d` can sit at index `i` without repeating in its row, column or box. */
export function fits(grid: Grid, i: number, d: number): boolean {
  const r = rowOf(i)
  const c = colOf(i)
  for (let k = 0; k < 9; k++) {
    const a = r * 9 + k
    const b = k * 9 + c
    if (a !== i && grid[a] === d) return false
    if (b !== i && grid[b] === d) return false
  }
  const br = r - (r % 3)
  const bc = c - (c % 3)
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const j = (br + x) * 9 + bc + y
      if (j !== i && grid[j] === d) return false
    }
  }
  return true
}

export function candidates(grid: Grid, i: number): number[] {
  const out: number[] = []
  for (let d = 1; d <= 9; d++) if (fits(grid, i, d)) out.push(d)
  return out
}

/** Indices of filled squares whose digit repeats in their row, column or box. */
export function findClashes(grid: Grid): number[] {
  const out: number[] = []
  for (let i = 0; i < 81; i++) if (grid[i] && !fits(grid, i, grid[i])) out.push(i)
  return out
}

/** Backtracking solver that always branches on the most-constrained square. */
export function solveGrid(grid: Grid, maxSteps = 400_000): Grid | null {
  const a = grid.slice()
  let steps = 0

  function rec(): boolean {
    let best = -1
    let bestCands: number[] | null = null
    for (let i = 0; i < 81; i++) {
      if (a[i]) continue
      const c = candidates(a, i)
      if (c.length === 0) return false
      if (!bestCands || c.length < bestCands.length) {
        best = i
        bestCands = c
        if (c.length === 1) break
      }
    }
    if (best < 0 || !bestCands) return true
    for (const d of bestCands) {
      a[best] = d
      if (++steps > maxSteps) return false
      if (rec()) return true
    }
    a[best] = 0
    return false
  }

  return rec() ? a : null
}

function validate(values: Grid): SolverMessage | null {
  const clashes = findClashes(values)
  if (clashes.length) {
    return {
      tone: "error",
      text: `${clashes.length} squares clash. Each row, column and 3×3 box can use a digit only once — fix the squares marked in red.`,
    }
  }
  const clues = values.filter(Boolean).length
  if (clues === 81) return { tone: "ok", text: "The board is already complete." }
  if (clues < MIN_CLUES) {
    return {
      tone: "error",
      text: `Enter at least ${MIN_CLUES} digits so the puzzle has a single answer. You have ${clues}.`,
    }
  }
  return null
}

const NO_SOLUTION: SolverMessage = {
  tone: "error",
  text: "No solution: these digits can’t all be right at once. Double-check them against your puzzle.",
}

/** Fill every empty square, marking the new digits as solved. */
export async function solvePuzzle(values: Grid, origins: CellOrigin[]): Promise<SolverResult> {
  const problem = validate(values)
  if (problem) return { message: problem }
  const t0 = performance.now()

  //convert number[] to string for API request
  const puzzle = values.join("")

  //POST /solve, use "one_at_a_time"
  const res = await fetch(API_URL + "/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puzzle, method: "one_at_a_time" }),
  })


  //if !solved, return error
  if (res.status == 200){
    const data = await res.json()

    if (!data.solved) return { message: NO_SOLUTION }

    const solution: number[] = Array.from(data.solution, Number)
    const ms = Math.max(1, Math.round(performance.now() - t0))

    //counts how many squares the model solved
    const nextOrigins = origins.slice()
    let filled = 0
    for (let i = 0; i < 81; i++) {
      if (!values[i]) {
        nextOrigins[i] = "solved"
        filled++
      }
    }
    return {
      values: solution,
      origins: nextOrigins,
      message: { tone: "ok", text: `Solved — filled ${filled} squares in ${ms} ms.` },
    }

  } 

  return {
    message: {
      tone: "error",
      text: "Error Fetching Solution"
    }
  }

}

/** Reveal the empty square with the fewest candidates. */
export function revealOne(values: Grid, origins: CellOrigin[]): SolverResult {
  const problem = validate(values)
  if (problem) return { message: problem }

  //POST /hint

  const solution = solveGrid(values)
  if (!solution) return { message: NO_SOLUTION }

  let best = -1
  let fewest = 10
  for (let i = 0; i < 81; i++) {
    if (values[i]) continue
    const n = candidates(values, i).length
    if (n < fewest) {
      fewest = n
      best = i
    }
  }
  const nextValues = values.slice()
  const nextOrigins = origins.slice()
  nextValues[best] = solution[best]
  nextOrigins[best] = "solved"
  return {
    values: nextValues,
    origins: nextOrigins,
    selected: best,
    message: {
      tone: "ok",
      text: `Placed ${solution[best]} at row ${rowOf(best) + 1}, column ${colOf(best) + 1}.`,
    },
  }
}
