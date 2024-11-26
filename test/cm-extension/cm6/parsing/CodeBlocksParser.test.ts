import { describe, expect, it } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeBlocksParser } from "@cm-extension/cm6/parsing/CodeBlocksParser"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("CodeBlocksParser", () => {
  describe("parse", () => {
    it.each(emptyCases)("returns empty when $reason", ({ state }) => {
      expect(CodeBlocksParser.parse(state)).toBeEmpty()
    })

    it("parses code blocks", () => {
      const state = InlineState`
         # H1
         ~~~
         ~~~
         # H2
         ~~~
         code
         ~~~
         - list1
         - list2
         ~~~typescript
         code
         ~~~
         
            ~~~~~~some other language
            code1
            code2
            ~~~~~~
         # H3
      `

      expect(CodeBlocksParser.parse(state)).toStrictEqual([
        CodeBlock.of({
          openingFence: { from: 5, to: 8, number: 2, text: "~~~" },
          closingFence: { from: 9, to: 12, number: 3, text: "~~~" },
          lang: undefined,
        }),
        CodeBlock.of({
          openingFence: { from: 18, to: 21, number: 5, text: "~~~" },
          closingFence: { from: 27, to: 30, number: 7, text: "~~~" },
          lang: undefined,
        }),
        CodeBlock.of({
          openingFence: { from: 47, to: 60, number: 10, text: "~~~typescript" },
          closingFence: { from: 66, to: 69, number: 12, text: "~~~" },
          lang: "typescript",
        }),
        CodeBlock.of({
          openingFence: { from: 71, to: 99, number: 14, text: "   ~~~~~~some other language" },
          closingFence: { from: 118, to: 127, number: 17, text: "   ~~~~~~" },
          lang: "some other language",
        }),
      ])
    })
  })
})

const emptyCases = [
  {
    reason: "no code blocks",
    state: InlineState`
      # H1
    `,
  },
  {
    reason: "dangling code block",
    state: InlineState`
      ~~~
    `,
  },
  {
    reason: "dangling code block with lang",
    state: InlineState`
      ~~~lang
    `,
  },
  {
    reason: "dangling code block with code",
    state: InlineState`
      ~~~
      code
    `,
  },
  {
    reason: "dangling code block with lang and code",
    state: InlineState`
      ~~~lang
      code
    `,
  },
  {
    reason: "code block with same fence inside",
    state: InlineState`
      ~~~lang
      ~~~lang
      ~~~
    `,
  },
  {
    reason: "code block with different fence inside",
    state: InlineState`
      ~~~lang
      \`\`\`lang
      ~~~
    `,
  },
]
