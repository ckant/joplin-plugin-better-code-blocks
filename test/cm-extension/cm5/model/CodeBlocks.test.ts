import { describe, expect, it } from "vitest"

import { LineSegment } from "@ext/codemirror/cm5/LineSegment"

import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { CodeBlocks } from "@cm-extension/cm5/model/CodeBlocks"

describe("CodeBlocks", () => {
  describe("areEqual", () => {
    const first = codeBlockOf({ startLine: 0, endLine: 1 })
    const second = codeBlockOf({ startLine: 2, endLine: 3 })

    it("equal (empty)", () => {
      expect(CodeBlocks.areEqual([], [])).toBe(true)
    })

    it("equal (same elements)", () => {
      expect(CodeBlocks.areEqual([first, second], [first, second])).toBe(true)
    })

    it("not equal (different elements)", () => {
      expect(CodeBlocks.areEqual([first], [second])).toBe(false)
    })

    it("not equal (different order)", () => {
      expect(CodeBlocks.areEqual([first, second], [second, first])).toBe(false)
    })
  })
})

function codeBlockOf({ startLine, endLine }: { startLine: number; endLine: number }): CodeBlock {
  return CodeBlock.of({
    start: LineSegment.of({ line: startLine, from: 0, to: 0 }),
    end: LineSegment.of({ line: endLine, from: 0, to: 0 }),
    lang: "typescript",
    openingFence: "```typescript",
    closingFence: "```",
  })
}
