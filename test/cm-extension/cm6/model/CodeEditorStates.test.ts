import { EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"
import { Config } from "@cm-extension/cm6/model/Config"
import { ConfigFacet } from "@cm-extension/cm6/state/ConfigFacet"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("CodeEditorStates", () => {
  describe("getConfig", () => {
    it("returns config facet", () => {
      const config = Config.createDefault()

      expect(
        CodeEditorStates.getConfig(EditorState.create({ extensions: ConfigFacet.of(config) })),
      ).toBe(config)
    })
  })

  describe("getCodeBlocks", () => {
    it("returns code blocks state field", () => {
      const state = InlineState`
      ~~~
      ~~~
      `

      expect(CodeEditorStates.getCodeBlocks(state)).toStrictEqual([
        CodeBlock.of({
          openingFence: { from: 0, to: 3, number: 1, text: "~~~" },
          closingFence: { from: 4, to: 7, number: 2, text: "~~~" },
          lang: undefined,
        }),
      ])
    })
  })
})
