import { BoardStatus } from "web-app"

export function InProgress() {
  return <BoardStatus filled={30} />
}

export function Compact() {
  return <BoardStatus filled={30} format="compact" />
}

export function Clashing() {
  return <BoardStatus filled={31} clashes={2} />
}

export function Solved() {
  return <BoardStatus filled={81} />
}
