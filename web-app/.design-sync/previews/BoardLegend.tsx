import { BoardLegend } from "web-app"

export function Default() {
  return <BoardLegend />
}

export function Dark() {
  return (
    <div className="dark text-foreground bg-background p-4">
      <BoardLegend />
    </div>
  )
}
