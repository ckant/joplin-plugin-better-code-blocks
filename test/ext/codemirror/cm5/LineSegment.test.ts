import { describe, expect, it } from "vitest"

import { LineSegment } from "@ext/codemirror/cm5/LineSegment"

describe("LineSegment", () => {
  describe("of", () => {
    it("throws Error if line is negative / not an integer", () => {
      expect(() => LineSegment.of({ line: -1, from: 0, to: 0 })).toThrowError()
    })

    it("throws Error if from is negative / not an integer", () => {
      expect(() => LineSegment.of({ line: 0, from: -1, to: 0 })).toThrowError()
    })

    it("throws Error if to is negative / not an integer", () => {
      expect(() => LineSegment.of({ line: 0, from: 0, to: -1 })).toThrowError()
    })

    it("throws Error if [from,to] is an invalid range", () => {
      expect(() => LineSegment.of({ line: 0, from: 5, to: 0 })).toThrowError()
    })
  })

  describe("fromPosition", () => {
    it("converts 'from' to the equivalent position", () => {
      expect(LineSegment.of({ line: 1, from: 2, to: 3 }).fromPosition).toEqual({ line: 1, ch: 2 })
    })
  })

  describe("toPosition", () => {
    it("converts 'to' to the equivalent position", () => {
      expect(LineSegment.of({ line: 1, from: 2, to: 3 }).toPosition).toEqual({ line: 1, ch: 3 })
    })
  })

  describe("plusLines", () => {
    it("returns a new LineSegment with the added lines", () => {
      expect(LineSegment.of({ line: 1, from: 2, to: 3 }).plusLines(5)).toEqual(
        LineSegment.of({ line: 6, from: 2, to: 3 }),
      )
    })

    it("throws Error if addedLines is not an integer", () => {
      expect(() => LineSegment.of({ line: 1, from: 2, to: 3 }).plusLines(0.5)).toThrowError()
    })
  })

  describe("equals", () => {
    it("equal", () => {
      const first = LineSegment.of({ line: 1, from: 0, to: 10 })
      const second = LineSegment.of({ line: 1, from: 0, to: 10 })

      expect(first.equals(second)).toBe(true)
      expect(second.equals(first)).toBe(true)
    })

    it.each([
      {
        issue: "different from",
        other: LineSegment.of({ line: 1, from: 1, to: 3 }),
      },
      {
        issue: "different to",
        other: LineSegment.of({ line: 1, from: 2, to: 4 }),
      },
      {
        issue: "different line",
        other: LineSegment.of({ line: 2, from: 2, to: 3 }),
      },
    ])("not equal when other has $issue", ({ other }) => {
      const first = LineSegment.of({ line: 1, from: 2, to: 3 })

      expect(first.equals(other)).toBe(false)
      expect(other.equals(first)).toBe(false)
    })
  })
})
