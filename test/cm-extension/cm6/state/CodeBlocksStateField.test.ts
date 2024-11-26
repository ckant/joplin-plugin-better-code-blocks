import { describe, expect, it } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeBlocksStateField } from "@cm-extension/cm6/state/CodeBlocksStateField"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("CodeBlocksStateField", () => {
  describe("create", () => {
    it("returns code blocks in doc", () => {
      const state = InlineState`
        ~~~
        ~~~
      `

      expect(CodeBlocksStateField.create(state)).toStrictEqual([
        CodeBlock.of({
          openingFence: { from: 0, to: 3, number: 1, text: "~~~" },
          closingFence: { from: 4, to: 7, number: 2, text: "~~~" },
          lang: undefined,
        }),
      ])
    })
  })

  describe("update", () => {
    it("returns original code blocks when doc not updated", () => {
      const state = InlineState`
        ~~~
        ~~~
      `

      const codeBlock = CodeBlock.of({
        openingFence: { from: 0, to: 3, number: 1, text: "~~~" },
        closingFence: { from: 4, to: 7, number: 2, text: "~~~" },
        lang: undefined,
      })

      expect(CodeBlocksStateField.update([codeBlock], state.update({}))).toStrictEqual([codeBlock])
    })

    it("returns code blocks in updated doc", () => {
      const state = InlineState``

      expect(
        CodeBlocksStateField.update([], state.update({ changes: { from: 0, insert: "```\n```" } })),
      ).toStrictEqual([
        CodeBlock.of({
          openingFence: { from: 0, to: 3, number: 1, text: "```" },
          closingFence: { from: 4, to: 7, number: 2, text: "```" },
          lang: undefined,
        }),
      ])
    })
  })
})
