import { describe, expect, it } from "vitest"

import { Arrays } from "@ext/stdlib/Arrays"

describe("Arrays", () => {
  describe("compact", () => {
    it("removes null and undefined values", () => {
      expect(Arrays.compact(["", 0, false, "foo", {}, NaN, undefined])).toStrictEqual([
        "",
        0,
        false,
        "foo",
        {},
        NaN,
      ])
    })
  })

  describe("onlyElement", () => {
    it("returns only element", () => {
      expect(Arrays.onlyElement(["first"])).toStrictEqual("first")
    })

    it("throws Error if more or less than one element", () => {
      expect(() => Arrays.onlyElement([])).toThrowError()
    })
  })
})
