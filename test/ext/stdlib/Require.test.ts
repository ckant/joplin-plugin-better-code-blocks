import { describe, expect, it } from "vitest"

import { Require } from "@ext/stdlib/Require"

describe("Require", () => {
  describe("integer", () => {
    it("allows integers", () => {
      expect(() => Require.integer(0)).not.toThrowError()
    })

    it("throws Error if non-integer", () => {
      expect(() => Require.integer(0.5)).toThrowError()
    })
  })

  describe("nonNegativeInteger", () => {
    it("allows 0", () => {
      expect(() => Require.nonNegativeInteger(0)).not.toThrowError()
    })

    it("allows positive integers", () => {
      expect(() => Require.nonNegativeInteger(1)).not.toThrowError()
    })

    it("throws Error if non-integer", () => {
      expect(() => Require.nonNegativeInteger(0.5)).toThrowError()
    })

    it("throws Error if negative integer", () => {
      expect(() => Require.nonNegativeInteger(-1)).toThrowError()
    })
  })

  describe("validRange", () => {
    it("allows valid range", () => {
      expect(() => Require.validRange({ from: 0, to: 0 })).not.toThrowError()
    })

    it("throws Error if invalid range", () => {
      expect(() => Require.validRange({ from: 5, to: 0 })).toThrowError()
    })
  })

  describe("hasSingleElement", () => {
    it("allows array with single element", () => {
      expect(() => Require.hasSingleElement(["first"])).not.toThrowError()
    })

    it("throws Error if zero elements", () => {
      expect(() => Require.hasSingleElement([])).toThrowError()
    })

    it("throws Error if more than 1 element", () => {
      expect(() => Require.hasSingleElement(["first", "second"])).toThrowError()
    })
  })
})
