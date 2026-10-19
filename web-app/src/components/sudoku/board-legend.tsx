import { cn } from "cn"

/** Key explaining the board's digit colors: yours, the solver's, and clashes. */
function BoardLegend({ className }: { className?: string }) {
  return (
    <div
      data-slot="board-legend"
      className={cn(
        "flex flex-wrap justify-center gap-5 text-[13px] text-muted-foreground",
        className
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span className="font-semibold text-foreground">5</span>
        Your digits
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="font-semibold text-solver">5</span>
        Filled by the solver
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-3.5 rounded-[3px] border border-destructive bg-destructive-soft" />
        Clashing digits
      </span>
    </div>
  )
}

export { BoardLegend }
