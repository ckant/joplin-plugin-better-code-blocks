import { describe, expect, it } from "vitest"

import { Iterables } from "@ext/stdlib/Iterables"

describe("Iterables", () => {
  describe("range", () => {
    it("throws Error if start is not an integer", () => {
      expect(() => Iterables.range({ start: 0.5, endExclusive: 2 })).toThrowError()
    })

    it("throws Error if endExclusive is not an integer", () => {
      expect(() => Iterables.range({ start: 0, endExclusive: 2.5 })).toThrowError()
    })

    it("throws Error if endExclusive is before start", () => {
      expect(() => Iterables.range({ start: 1, endExclusive: 0 })).toThrowError()
    })

    it("returns a new Iterable", () => {
      const firstIterable = Iterables.range({ start: 0, endExclusive: 0 })
      const secondIterable = Iterables.range({ start: 0, endExclusive: 0 })
      expect(firstIterable).not.toBe(secondIterable)
    })

    it("returns an Iterable over an empty range", () => {
      expect([...Iterables.range({ start: 2, endExclusive: 2 })]).toStrictEqual([])
    })

    it("returns an Iterable over a range with a single value", () => {
      expect([...Iterables.range({ start: 4, endExclusive: 5 })]).toStrictEqual([4])
    })

    it("returns an Iterable over a range", () => {
      expect([...Iterables.range({ start: -2, endExclusive: 3 })]).toStrictEqual([-2, -1, 0, 1, 2])
    })
  })

  describe("empty", () => {
    it("returns a new Iterable", () => {
      const firstIterable = Iterables.empty()
      const secondIterable = Iterables.empty()
      expect(firstIterable).not.toBe(secondIterable)
    })

    it("returns an Iterable over an empty range", () => {
      expect([...Iterables.empty()]).toStrictEqual([])
    })
  })
})
