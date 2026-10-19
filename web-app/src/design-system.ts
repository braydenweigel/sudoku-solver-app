// Public surface of the Sudoku Solver design system: the shadcn/ui primitives
// this app uses plus its sudoku-specific components and solver helpers.
// Consumed by `npm run build:ds` (declarations + compiled CSS) for design-sync.
export { Badge, badgeVariants } from "./components/ui/badge"
export { Button, buttonVariants } from "./components/ui/button"
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
export { Kbd, KbdGroup } from "./components/ui/kbd"
export { ThemeProvider, useTheme } from "./components/theme-provider"
export { ThemeToggle } from "./components/theme-toggle"
export { BoardLegend } from "./components/sudoku/board-legend"
export { BoardStatus, type BoardStatusProps } from "./components/sudoku/board-status"
export { NumberPad, type NumberPadProps } from "./components/sudoku/number-pad"
export { SolverStatus, type SolverStatusProps } from "./components/sudoku/solver-status"
export { SudokuBoard, type SudokuBoardProps } from "./components/sudoku/sudoku-board"
export * from "./lib/sudoku"
