import { describe, expect, it } from "vitest"

import { CodeFenceAtomicRanges } from "@cm-extension/cm6/modification/cursor/CodeFenceAtomicRanges"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { RangeSets } from "test-support/ext/codemirror/cm6/RangeSets"
import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"

describe("CodeFenceAtomicRanges", () => {
  it("builds a range sets of code blocks", () => {
    const view = FakeEditorView.create({
      state: InlineState`
        ~~~lang
        code
        ~~~
      `,
    })

    expect(
      RangeSets.getRanges(CodeFenceAtomicRanges(view)).map(({ from, to }) => ({ from, to })),
    ).toStrictEqual([
      { from: 0, to: 7 },
      { from: 13, to: 16 },
    ])
  })
})
