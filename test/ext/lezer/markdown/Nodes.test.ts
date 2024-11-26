import { describe, expect, it } from "vitest"

import { Nodes } from "@ext/lezer/markdown/Nodes"

describe("Nodes", () => {
  describe("isFencedCode", () => {
    it("returns true when fenced code", () => {
      expect(Nodes.isFencedCode({ name: "FencedCode", from: 0, to: 3 })).toBeTrue()
    })

    it("returns false when not fenced code", () => {
      expect(Nodes.isFencedCode({ name: "NotFencedCode", from: 0, to: 3 })).toBeFalse()
    })
  })

  describe("isCodeMark", () => {
    it("returns true when code mark", () => {
      expect(Nodes.isCodeMark({ name: "CodeMark", from: 0, to: 3 })).toBeTrue()
    })

    it("returns false when not code mark", () => {
      expect(Nodes.isCodeMark({ name: "NotCodeMark", from: 0, to: 3 })).toBeFalse()
    })
  })

  describe("isCodeInfo", () => {
    it("returns true when code info", () => {
      expect(Nodes.isCodeInfo({ name: "CodeInfo", from: 0, to: 3 })).toBeTrue()
    })

    it("returns false when not code info", () => {
      expect(Nodes.isCodeInfo({ name: "NotCodeInfo", from: 0, to: 3 })).toBeFalse()
    })
  })
})
