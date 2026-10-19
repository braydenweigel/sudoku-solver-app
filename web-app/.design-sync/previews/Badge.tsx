import { Badge } from "web-app"

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>New</Badge>
      <Badge variant="secondary">Easy</Badge>
      <Badge variant="outline">30 of 81 filled</Badge>
      <Badge variant="destructive">2 clashing</Badge>
    </div>
  )
}
