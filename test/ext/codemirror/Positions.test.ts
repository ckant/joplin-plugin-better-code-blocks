import { describe, expect, it } from "vitest"

import { Positions } from "@ext/codemirror/Positions"

describe("Positions", () => {
  describe("areEqual", () => {
    it("returns true when equal", () => {
      expect(Positions.areEqual({ line: 0, ch: 0 }, { line: 0, ch: 0 })).toBeTrue()
    })

    it("returns false when not equal, different lines", () => {
      expect(Positions.areEqual({ line: 0, ch: 0 }, { line: 1, ch: 0 })).toBeFalse()
      expect(Positions.areEqual({ line: 1, ch: 0 }, { line: 0, ch: 1 })).toBeFalse()
    })

    it("returns false when not equal, different chs", () => {
      expect(Positions.areEqual({ line: 0, ch: 0 }, { line: 0, ch: 1 })).toBeFalse()
      expect(Positions.areEqual({ line: 0, ch: 1 }, { line: 0, ch: 0 })).toBeFalse()
    })
  })

  describe("areStrictlyOrdered", () => {
    it("returns true when before line", () => {
      expect(
        Positions.areStrictlyOrdered({ before: { line: 0, ch: 0 }, after: { line: 1, ch: 0 } }),
      ).toBeTrue()
    })

    it("returns true when same line and before ch", () => {
      expect(
        Positions.areStrictlyOrdered({ before: { line: 0, ch: 0 }, after: { line: 0, ch: 1 } }),
      ).toBeTrue()
    })

    it("returns false when after line", () => {
      expect(
        Positions.areStrictlyOrdered({ before: { line: 1, ch: 0 }, after: { line: 0, ch: 0 } }),
      ).toBeFalse()
    })

    it("returns false when same line and after ch", () => {
      expect(
        Positions.areStrictlyOrdered({ before: { line: 0, ch: 1 }, after: { line: 0, ch: 0 } }),
      ).toBeFalse()
    })
  })
})
