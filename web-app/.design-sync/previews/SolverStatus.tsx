import { SolverStatus } from "web-app"

export function Success() {
  return (
    <div className="w-[280px]">
      <SolverStatus tone="ok">Solved — filled 51 squares in 3 ms.</SolverStatus>
    </div>
  )
}

export function Hint() {
  return (
    <div className="w-[280px]">
      <SolverStatus tone="ok">Placed 5 at row 5, column 5.</SolverStatus>
    </div>
  )
}

export function Error() {
  return (
    <div className="w-[280px]">
      <SolverStatus tone="error">
        2 squares clash. Each row, column and 3×3 box can use a digit only once — fix the squares
        marked in red.
      </SolverStatus>
    </div>
  )
}
