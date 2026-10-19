import * as React from "react"
import { SudokuBoard, EXAMPLE_PUZZLE, parseGrid, originsFor, solvePuzzle } from "web-app"

const puzzle = parseGrid(EXAMPLE_PUZZLE)

export function Interactive() {
  const [values, setValues] = React.useState(puzzle)
  const [selected, setSelected] = React.useState<number | null>(40)
  return (
    <div className="w-[420px]">
      <SudokuBoard
        values={values}
        origins={originsFor(puzzle)}
        selected={selected}
        onSelect={setSelected}
        onInput={(d) => {
          if (selected === null) return
          const next = values.slice()
          next[selected] = d
          setValues(next)
        }}
      />
    </div>
  )
}

export function Solved() {
  const result = solvePuzzle(puzzle, originsFor(puzzle))
  return (
    <div className="w-[420px]">
      <SudokuBoard values={result.values!} origins={result.origins} selected={null} />
    </div>
  )
}

export function Clashing() {
  const values = puzzle.slice()
  values[2] = 5
  return (
    <div className="w-[420px]">
      <SudokuBoard values={values} origins={originsFor(values)} selected={2} />
    </div>
  )
}

export function CompactDark() {
  return (
    <div className="dark text-foreground w-[358px] bg-background p-3">
      <SudokuBoard values={puzzle} origins={originsFor(puzzle)} selected={40} size="sm" />
    </div>
  )
}
