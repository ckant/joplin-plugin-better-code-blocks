import { RangeSet, RangeValue } from "@codemirror/state"

import { def } from "@ext/stdlib/existence"

export namespace RangeSets {
  export function getRanges<T extends RangeValue>(
    rangeSet: RangeSet<T>,
  ): readonly { from: number; to: number; value: T }[] {
    const cursor = rangeSet.iter()

    const ranges: { from: number; to: number; value: T }[] = []
    do {
      ranges.push({ from: cursor.from, to: cursor.to, value: cursor.value! })
      cursor.next()
    } while (def(cursor.value))

    return ranges
  }
}
