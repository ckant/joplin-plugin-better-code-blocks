import { describe, expect, it } from "vitest"

import { Range } from "@ext/codemirror/Range"

describe("Range", () => {
  describe("equals", () => {
    it("returns true when equal", () => {
      const firstRange = Range.of({ from: { line: 1, ch: 2 }, to: { line: 3, ch: 4 } })
      const secondRange = Range.of({ from: { line: 1, ch: 2 }, to: { line: 3, ch: 4 } })

      expect(firstRange.equals(secondRange)).toBeTrue()
      expect(secondRange.equals(firstRange)).toBeTrue()
    })

    it("returns false when not equal, different froms", () => {
      const firstRange = Range.of({ from: { line: 1, ch: 2 }, to: { line: 3, ch: 4 } })
      const secondRange = Range.of({ from: { line: 0, ch: 2 }, to: { line: 3, ch: 4 } })

      expect(firstRange.equals(secondRange)).toBeFalse()
      expect(secondRange.equals(firstRange)).toBeFalse()
    })

    it("returns false when not equal, different tos", () => {
      const firstRange = Range.of({ from: { line: 1, ch: 2 }, to: { line: 3, ch: 4 } })
      const secondRange = Range.of({ from: { line: 1, ch: 2 }, to: { line: 3, ch: 5 } })

      expect(firstRange.equals(secondRange)).toBeFalse()
      expect(secondRange.equals(firstRange)).toBeFalse()
    })
  })
})
