import { describe, expect, it } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeDocs } from "@cm-extension/cm6/model/CodeDocs"

import { InlineText } from "test-support/ext/codemirror/cm6/InlineText"

describe("CodeDocs", () => {
  describe("getCode", () => {
    it("returns code when fences are included", () => {
      const doc = InlineText`
      ~~~lang
      code
      ~~~
      `
      const codeBlock = CodeBlock.of({
        openingFence: { from: 0, to: 7, number: 1, text: "~~~lang" },
        closingFence: { from: 13, to: 16, number: 3, text: "~~~" },
        lang: "lang",
      })

      expect(CodeDocs.getCode(doc, codeBlock, { includeFences: true })).toBe("~~~lang\ncode\n~~~")
    })

    it("returns empty string when fences aren't included and no code", () => {
      const doc = InlineText`
      ~~~lang
      ~~~
      `
      const codeBlock = CodeBlock.of({
        openingFence: { from: 0, to: 7, number: 1, text: "~~~lang" },
        closingFence: { from: 8, to: 11, number: 2, text: "~~~" },
        lang: "lang",
      })

      expect(CodeDocs.getCode(doc, codeBlock, { includeFences: false })).toBe("")
    })

    it("returns code when fences aren't included", () => {
      const doc = InlineText`
      ~~~lang
      code
      ~~~
      `
      const codeBlock = CodeBlock.of({
        openingFence: { from: 0, to: 7, number: 1, text: "~~~lang" },
        closingFence: { from: 13, to: 16, number: 3, text: "~~~" },
        lang: "lang",
      })

      expect(CodeDocs.getCode(doc, codeBlock, { includeFences: false })).toBe("code")
    })
  })
})
