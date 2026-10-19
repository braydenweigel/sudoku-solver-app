import { MoonIcon, SunIcon } from "lucide-react"
import { cn } from "cn"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

function resolveTheme(theme: "dark" | "light" | "system") {
  if (theme !== "system") return theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/** Outline icon button that flips between light and dark mode. Needs ThemeProvider. */
function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const isDark = resolveTheme(theme) === "dark"
  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("bg-card text-foreground shadow-xs dark:bg-card", className)}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export { ThemeToggle }
