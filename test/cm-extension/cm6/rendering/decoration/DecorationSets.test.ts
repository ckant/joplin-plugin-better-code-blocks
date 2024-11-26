import { describe, expect, it } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { Config } from "@cm-extension/cm6/model/Config"
import { DecorationSets } from "@cm-extension/cm6/rendering/decoration/DecorationSets"
import { LineDecorations } from "@cm-extension/cm6/rendering/decoration/LineDecorations"
import { ReplaceDecorations } from "@cm-extension/cm6/rendering/decoration/ReplaceDecorations"

import { InlineText } from "test-support/ext/codemirror/cm6/InlineText"
import { RangeSets } from "test-support/ext/codemirror/cm6/RangeSets"
import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"
import { Any } from "test-support/fixtures/cm6/Any"

describe("DecorationSets", () => {
  describe("create", () => {
    it("creates decorations excluding code blocks that are not visible", () => {
      const view = FakeEditorView.create({
        visibleRanges: [{ from: 8, to: 24 }],
        state: Any.stateWith({
          doc,
          config: {
            ...Config.createDefault(),
            excludedLanguages: [],
          },
        }),
      })

      expect(RangeSets.getRanges(DecorationSets.create(view))).toStrictEqual([
        ...secondCodeBlockDecorations,
      ])
    })
  })

  it("creates decorations excluding code blocks with languages that are excluded", () => {
    const view = FakeEditorView.create({
      visibleRanges: [{ from: 0, to: 24 }],
      state: Any.stateWith({
        doc,
        config: {
          ...Config.createDefault(),
          excludedLanguages: ["lang"],
        },
      }),
    })

    expect(RangeSets.getRanges(DecorationSets.create(view))).toStrictEqual([
      ...firstCodeBlockDecorations,
    ])
  })

  it("creates decorations for code blocks", () => {
    const view = FakeEditorView.create({
      visibleRanges: [{ from: 0, to: 24 }],
      state: Any.stateWith({
        doc,
        config: {
          ...Config.createDefault(),
          excludedLanguages: [],
        },
      }),
    })

    expect(RangeSets.getRanges(DecorationSets.create(view))).toStrictEqual([
      ...firstCodeBlockDecorations,
      ...secondCodeBlockDecorations,
    ])
  })
})

const doc = InlineText`
  ~~~
  ~~~
  ~~~lang
  code
  ~~~
`
const firstCodeBlock = CodeBlock.of({
  openingFence: { from: 0, to: 3, number: 1, text: "~~~" },
  closingFence: { from: 4, to: 7, number: 2, text: "~~~" },
  lang: undefined,
})

const secondCodeBlock = CodeBlock.of({
  openingFence: { from: 8, to: 15, number: 3, text: "~~~lang" },
  closingFence: { from: 21, to: 24, number: 5, text: "~~~" },
  lang: "lang",
})

const firstCodeBlockDecorations = [
  { from: 0, to: 0, value: LineDecorations.openingFence },
  { from: 0, to: 3, value: ReplaceDecorations.openingFence(firstCodeBlock) },
  { from: 4, to: 4, value: LineDecorations.closingFence },
  { from: 4, to: 7, value: ReplaceDecorations.closingFence(firstCodeBlock) },
]

const secondCodeBlockDecorations = [
  { from: 8, to: 8, value: LineDecorations.openingFence },
  { from: 8, to: 15, value: ReplaceDecorations.openingFence(secondCodeBlock) },
  { from: 16, to: 16, value: LineDecorations.code({ isFirst: true, isLast: true }) },
  { from: 21, to: 21, value: LineDecorations.closingFence },
  { from: 21, to: 24, value: ReplaceDecorations.closingFence(secondCodeBlock) },
]
