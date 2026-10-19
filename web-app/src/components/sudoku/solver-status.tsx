import * as React from "react"
import { cn } from "cn"

type SolverStatusProps = React.ComponentProps<"p"> & {
  /** "error" renders in the destructive colors; "ok" on a muted surface. */
  tone?: "ok" | "error"
}

/** Live-region message reporting what the solver just did, or why it couldn't. */
function SolverStatus({ tone = "ok", className, ...props }: SolverStatusProps) {
  return (
    <p
      role="status"
      data-slot="solver-status"
      data-tone={tone}
      className={cn(
        "m-0 rounded-lg bg-muted px-3 py-2.5 text-[13px] leading-[1.45] text-foreground",
        "data-[tone=error]:bg-destructive-soft data-[tone=error]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

export { SolverStatus }
export type { SolverStatusProps }
