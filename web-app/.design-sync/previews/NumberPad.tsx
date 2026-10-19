import { NumberPad } from "web-app"

export function Grid() {
  return (
    <div className="w-[260px]">
      <NumberPad layout="grid" />
    </div>
  )
}

export function Row() {
  return (
    <div className="w-[358px]">
      <NumberPad layout="row" />
    </div>
  )
}

export function RowDark() {
  return (
    <div className="dark text-foreground w-[358px] bg-background p-3">
      <NumberPad layout="row" />
    </div>
  )
}
