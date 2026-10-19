import * as React from "react"
import { cn } from "cn"

import {
  boxOf,
  colOf,
  findClashes,
  rowOf,
} from "@/lib/sudoku"

type CellState = "clash" | "selected" | "match" | "peer" | undefined

type SudokuBoardProps = Omit<React.ComponentProps<"div">, "onSelect" | "onInput"> & {
  /** 81 digits in row-major order; 0 is an empty square. */
  values: number[]
  /** Per-square origin: "solved" digits render in the solver color. */
  origins?: ("given" | "solved" | null)[]
  /** Index (0–80) of the selected square, or null for none. */
  selected?: number | null
  /** Called when a square is clicked or the arrow keys move the selection. */
  onSelect?: (index: number) => void
  /** Called with 1–9 when a digit key is pressed, or 0 for Backspace/Delete. */
  onInput?: (digit: number) => void
  /** "default" scales digits up from phone (19px) to desktop (26px); "sm" stays at 19px. */
  size?: "default" | "sm"
}

const MOVES: Record<string, number> = {
  ArrowUp: -9,
  ArrowDown: 9,
  ArrowLeft: -1,
  ArrowRight: 1,
}

function SudokuBoard({
  values,
  origins,
  selected = null,
  onSelect,
  onInput,
  size = "default",
  className,
  onKeyDown,
  ...props
}: SudokuBoardProps) {
  const cellRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const boardRef = React.useRef<HTMLDivElement>(null)
  const clashes = React.useMemo(() => new Set(findClashes(values)), [values])

  // Keep keyboard focus on the selected square while the board has focus.
  React.useEffect(() => {
    if (selected === null) return
    if (boardRef.current?.contains(document.activeElement)) {
      cellRefs.current[selected]?.focus()
    }
  }, [selected])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || selected === null) return
    const { key } = event
    if (key >= "1" && key <= "9") {
      event.preventDefault()
      onInput?.(Number(key))
      return
    }
    if (key === "Backspace" || key === "Delete" || key === "0") {
      event.preventDefault()
      onInput?.(0)
      return
    }
    const move = MOVES[key]
    if (move === undefined) return
    event.preventDefault()
    if (key === "ArrowLeft" && colOf(selected) === 0) return
    if (key === "ArrowRight" && colOf(selected) === 8) return
    const next = selected + move
    if (next >= 0 && next < 81) onSelect?.(next)
  }

  function cellState(i: number): CellState {
    if (clashes.has(i)) return "clash"
    if (selected === null) return undefined
    if (i === selected) return "selected"
    if (values[i] && values[i] === values[selected]) return "match"
    if (
      rowOf(i) === rowOf(selected) ||
      colOf(i) === colOf(selected) ||
      boxOf(i) === boxOf(selected)
    ) {
      return "peer"
    }
    return undefined
  }

  return (
    <div
      ref={boardRef}
      role="group"
      aria-label="Sudoku board"
      data-slot="sudoku-board"
      data-size={size}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/board grid w-full grid-cols-3 gap-0.5 overflow-hidden rounded-[10px] border-2 border-grid-box bg-grid-box",
        className
      )}
      {...props}
    >
      {Array.from({ length: 9 }, (_, box) => {
        const br = Math.floor(box / 3) * 3
        const bc = (box % 3) * 3
        return (
          <div key={box} className="grid grid-cols-3 gap-px bg-grid-line">
            {Array.from({ length: 9 }, (_, k) => {
              const r = br + Math.floor(k / 3)
              const c = bc + (k % 3)
              const i = r * 9 + c
              const v = values[i]
              return (
                <button
                  key={i}
                  ref={(el) => {
                    cellRefs.current[i] = el
                  }}
                  type="button"
                  tabIndex={i === (selected ?? 0) ? 0 : -1}
                  aria-pressed={i === selected}
                  aria-invalid={clashes.has(i) || undefined}
                  aria-label={`Row ${r + 1}, column ${c + 1}, ${v || "empty"}`}
                  data-state={cellState(i)}
                  data-origin={origins?.[i] ?? undefined}
                  data-selected={i === selected || undefined}
                  onClick={() => onSelect?.(i)}
                  className={cn(
                    "flex aspect-square w-full cursor-pointer items-center justify-center bg-cell font-semibold text-foreground tabular-nums outline-none select-none",
                    size === "sm" ? "text-[19px]" : "text-[19px] md:text-[26px]",
                    "data-[state=peer]:bg-cell-peer data-[state=match]:bg-cell-selected data-[state=selected]:bg-cell-selected",
                    "data-[origin=solved]:font-medium data-[origin=solved]:text-solver",
                    "data-[state=clash]:bg-destructive-soft data-[state=clash]:text-destructive",
                    "data-selected:shadow-[inset_0_0_0_2px_var(--solver)]"
                  )}
                >
                  {v || ""}
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export { SudokuBoard }
export type { SudokuBoardProps }
