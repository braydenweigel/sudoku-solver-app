import { EraserIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

type NumberPadProps = {
  /** Called with the digit (1–9) the player pressed. */
  onDigit?: (digit: number) => void
  /** Called when the erase key is pressed. */
  onErase?: () => void
  /**
   * "grid": a 3×3 keypad with a full-width "Erase square" button below (desktop).
   * "row": a 5-column keypad with an icon-only erase key in the last slot (phone).
   */
  layout?: "grid" | "row"
  className?: string
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function NumberPad({ onDigit, onErase, layout = "grid", className }: NumberPadProps) {
  const isRow = layout === "row"
  return (
    <div
      data-slot="number-pad"
      data-layout={layout}
      className={cn("flex flex-col gap-2", className)}
    >
      <div className={cn("grid gap-2", isRow ? "grid-cols-5" : "grid-cols-3")}>
        {DIGITS.map((n) => (
          <Button
            key={n}
            variant="outline"
            aria-label={`Enter ${n}`}
            onClick={() => onDigit?.(n)}
            className={cn(
              "bg-card text-foreground shadow-xs tabular-nums dark:bg-card",
              isRow ? "h-12 text-[19px]" : "h-11 text-[17px]"
            )}
          >
            {n}
          </Button>
        ))}
        {isRow && (
          <Button
            variant="secondary"
            aria-label="Erase square"
            onClick={onErase}
            className="h-12 [&_svg:not([class*='size-'])]:size-5"
          >
            <EraserIcon />
          </Button>
        )}
      </div>
      {!isRow && (
        <Button variant="secondary" onClick={onErase} className="h-10">
          <EraserIcon data-icon="inline-start" />
          Erase square
        </Button>
      )}
    </div>
  )
}

export { NumberPad }
export type { NumberPadProps }
