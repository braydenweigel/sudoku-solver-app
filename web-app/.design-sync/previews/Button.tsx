import { Button } from "web-app"
import { LightbulbIcon, RotateCcwIcon, SparklesIcon } from "lucide-react"

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Solve puzzle</Button>
      <Button variant="outline">Reveal one square</Button>
      <Button variant="secondary">Erase square</Button>
      <Button variant="ghost">Load example</Button>
      <Button variant="destructive">Clear board</Button>
      <Button variant="link">How it works</Button>
    </div>
  )
}

export function WithIcons() {
  return (
    <div className="flex w-[280px] flex-col gap-2">
      <Button className="h-10">
        <SparklesIcon data-icon="inline-start" />
        Solve puzzle
      </Button>
      <Button variant="outline" className="h-10">
        <LightbulbIcon data-icon="inline-start" />
        Reveal one square
      </Button>
      <Button variant="ghost" className="h-9 text-muted-foreground">
        <RotateCcwIcon data-icon="inline-start" />
        Clear board
      </Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="outline" aria-label="Clear board">
        <RotateCcwIcon />
      </Button>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="flex items-center gap-2">
      <Button disabled>Solve puzzle</Button>
      <Button variant="outline" disabled>Reveal one square</Button>
    </div>
  )
}
