import { cn } from "cn"

import { Badge } from "@/components/ui/badge"

type BoardStatusProps = {
  /** How many of the 81 squares hold a digit. */
  filled: number
  /** How many squares currently clash with another. */
  clashes?: number
  /** "compact" reads "32 / 81" instead of "32 of 81 filled". */
  format?: "default" | "compact"
  className?: string
}

/** Pill summarizing the board: progress, "N clashing", or "Solved". */
function BoardStatus({ filled, clashes = 0, format = "default", className }: BoardStatusProps) {
  if (clashes > 0) {
    return (
      <Badge variant="destructive" className={cn("h-6 px-2.5", className)}>
        {clashes} clashing
      </Badge>
    )
  }
  if (filled === 81) {
    return (
      <Badge className={cn("h-6 bg-cell-selected px-2.5 text-solver", className)}>
        Solved
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className={cn("h-6 bg-muted px-2.5 tabular-nums", className)}>
      {format === "compact" ? `${filled} / 81` : `${filled} of 81 filled`}
    </Badge>
  )
}

export { BoardStatus }
export type { BoardStatusProps }
