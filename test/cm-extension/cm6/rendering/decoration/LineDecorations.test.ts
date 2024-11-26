import { describe, expect, it } from "vitest"

import { LineDecorations } from "@cm-extension/cm6/rendering/decoration/LineDecorations"

describe("LineDecorations", () => {
  describe("codeSpec", () => {
    it("returns a first and last code line decoration spec", () => {
      expect(LineDecorations.codeSpec({ isFirst: true, isLast: true })).toStrictEqual({
        attributes: { class: "cb-code-line cb-first cb-last" },
      })
    })

    it("returns a first code line decoration spec", () => {
      expect(LineDecorations.codeSpec({ isFirst: true, isLast: false })).toStrictEqual({
        attributes: { class: "cb-code-line cb-first" },
      })
    })

    it("returns a last code line decoration spec", () => {
      expect(LineDecorations.codeSpec({ isFirst: false, isLast: true })).toStrictEqual({
        attributes: { class: "cb-code-line cb-last" },
      })
    })

    it("returns a middle code line decoration spec", () => {
      expect(LineDecorations.codeSpec({ isFirst: false, isLast: false })).toStrictEqual({
        attributes: { class: "cb-code-line" },
      })
    })
  })

  describe("code", () => {
    it("returns a code line decoration", () => {
      expect(LineDecorations.code({ isFirst: true, isLast: true }).spec).toStrictEqual({
        attributes: { class: "cb-code-line cb-first cb-last" },
      })
    })
  })
})
