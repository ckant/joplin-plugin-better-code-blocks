import { describe, expect, it } from "vitest"

import { FenceCompletionParser } from "@cm-extension/cm6/parsing/FenceCompletionParser"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("FenceCompletionParser", () => {
  describe("parseOpeningFenceAt", () => {
    it("returns undefined when position before minimum code mark size", () => {
      const state = InlineState`
        ~~~
      `

      expect(FenceCompletionParser.parseOpeningFenceAt(state, 2)).toBeUndefined()
    })

    it("returns undefined when position not at code mark", () => {
      const state = InlineState`
        ~~~
        code
      `

      expect(FenceCompletionParser.parseOpeningFenceAt(state, 2)).toBeUndefined()
    })

    it("returns undefined when position at closing fence code mark", () => {
      const state = InlineState`
        ~~~
        ~~~
      `

      expect(FenceCompletionParser.parseOpeningFenceAt(state, 7)).toBeUndefined()
    })

    it("returns opening fence with code info", () => {
      const state = InlineState`
          ~~~~lang
        # H1
      `

      expect(FenceCompletionParser.parseOpeningFenceAt(state, 10)).toStrictEqual({
        indent: "  ",
        codeMark: "~~~~",
        codeInfoPrefix: "lang",
      })
    })

    it("returns opening fence without code info", () => {
      const state = InlineState`
        ~~~
      `

      expect(FenceCompletionParser.parseOpeningFenceAt(state, 3)).toStrictEqual({
        indent: "",
        codeMark: "~~~",
        codeInfoPrefix: "",
      })
    })
  })
})
