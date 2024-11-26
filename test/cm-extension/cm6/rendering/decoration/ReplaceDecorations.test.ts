import { describe, expect, it } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { ReplaceDecorations } from "@cm-extension/cm6/rendering/decoration/ReplaceDecorations"
import { Widgets } from "@cm-extension/cm6/rendering/decoration/Widgets"

describe("ReplaceDecorations", () => {
  describe("openingFenceSpec", () => {
    it("returns an opening fence replace decoration spec", () => {
      expect(ReplaceDecorations.openingFenceSpec(codeBlock)).toStrictEqual({
        widget: Widgets.OpeningFence.create({ codeBlock }),
      })
    })
  })

  describe("openingFence", () => {
    it("returns an opening fence replace decoration", () => {
      expect(ReplaceDecorations.openingFence(codeBlock).spec).toStrictEqual({
        widget: Widgets.OpeningFence.create({ codeBlock }),
      })
    })
  })

  describe("closingFenceSpec", () => {
    it("returns an closing fence replace decoration spec", () => {
      expect(ReplaceDecorations.closingFenceSpec(codeBlock)).toStrictEqual({
        widget: Widgets.ClosingFence.create({ codeBlock }),
      })
    })
  })

  describe("closingFence", () => {
    it("returns an closing fence replace decoration", () => {
      expect(ReplaceDecorations.closingFence(codeBlock).spec).toStrictEqual({
        widget: Widgets.ClosingFence.create({ codeBlock }),
      })
    })
  })
})

const codeBlock = CodeBlock.of({
  openingFence: { from: 8, to: 15, number: 3, text: "~~~lang" },
  closingFence: { from: 21, to: 24, number: 5, text: "~~~" },
  lang: "lang",
})
