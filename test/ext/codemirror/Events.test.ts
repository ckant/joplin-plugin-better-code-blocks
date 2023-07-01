import { EditorSelectionChange, Range, SelectionRange } from "codemirror"
import { describe, expect, it } from "vitest"

import { Events } from "@ext/codemirror/Events"

import { DocData } from "test-support/fixtures/DocData"

describe("Events", () => {
  describe("isSelectAll", () => {
    it.each(notSelectAll)("returns false when $type", ({ ranges }) => {
      expect(Events.isSelectAll(DocData.Any.simple().doc, changeOf(ranges))).toBeFalse()
    })

    it("return true when range is select all", () => {
      expect(
        Events.isSelectAll(
          DocData.Any.simple().doc,
          changeOf([{ anchor: { line: 0, ch: 0 }, head: { line: 4, ch: 3 } }]),
        ),
      ).toBeTrue()
    })
  })
})

const notSelectAll = [
  {
    type: "no ranges",
    ranges: [],
  },
  {
    type: "more than 1 range",
    ranges: [
      { anchor: { line: 0, ch: 1 }, head: { line: 2, ch: 3 } },
      { anchor: { line: 4, ch: 5 }, head: { line: 6, ch: 7 } },
    ],
  },
  {
    type: "range after first line",
    ranges: [{ anchor: { line: 1, ch: 0 }, head: { line: 4, ch: 3 } }],
  },
  {
    type: "range after first char",
    ranges: [{ anchor: { line: 0, ch: 1 }, head: { line: 4, ch: 3 } }],
  },
  {
    type: "range before last line",
    ranges: [{ anchor: { line: 0, ch: 0 }, head: { line: 3, ch: 3 } }],
  },
  {
    type: "range before last char",
    ranges: [{ anchor: { line: 0, ch: 0 }, head: { line: 4, ch: 2 } }],
  },
]

function changeOf(ranges: readonly SelectionRange[]): EditorSelectionChange {
  return {
    ranges: ranges as Range[],
    update: () => undefined,
  }
}
