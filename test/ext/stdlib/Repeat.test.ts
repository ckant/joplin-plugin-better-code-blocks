import { describe, expect, it } from "vitest"

import { Repeat } from "@ext/stdlib/Repeat"

describe("Repeat", () => {
  describe("times", () => {
    it("maps the given number of times", () => {
      expect(Repeat.times(3, (i) => i)).toStrictEqual([0, 1, 2])
    })

    it("maps 0 times to an empty array", () => {
      expect(Repeat.times(0, (i) => i)).toStrictEqual([])
    })

    it("throws Error if mapping non-integer", () => {
      expect(() => Repeat.times(0.5, (i) => i)).toThrowError()
    })

    it("throws Error if mapping negative integer", () => {
      expect(() => Repeat.times(-1, (i) => i)).toThrowError()
    })
  })
})
