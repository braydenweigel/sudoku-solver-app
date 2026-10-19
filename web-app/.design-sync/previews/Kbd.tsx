import { Kbd, KbdGroup } from "web-app"

export function ShortcutHints() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Kbd>1–9</Kbd>Place
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Kbd>⌫</Kbd>Erase
      </span>
      <span className="inline-flex items-center gap-1.5">
        <KbdGroup>
          <Kbd>←</Kbd>
          <Kbd>↑</Kbd>
          <Kbd>→</Kbd>
          <Kbd>↓</Kbd>
        </KbdGroup>
        Move
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Kbd>D</Kbd>Toggle dark mode
      </span>
    </div>
  )
}
