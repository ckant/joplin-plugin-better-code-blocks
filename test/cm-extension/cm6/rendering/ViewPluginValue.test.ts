import { describe, expect, it } from "vitest"

import { ViewPluginValue } from "@cm-extension/cm6/rendering/ViewPluginValue"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { RangeSets } from "test-support/ext/codemirror/cm6/RangeSets"
import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"
import { FakeViewUpdate } from "test-support/fakes/codemirror/cm6/view/FakeViewUpdate"

describe("ViewPluginValue", () => {
  describe("create", () => {
    it("creates decorations", () => {
      const view = FakeEditorView.create({ state, visibleRanges: [{ from: 0, to: 16 }] })

      const viewPlugin = ViewPluginValue.create({ view })
      expect(
        RangeSets.getRanges(viewPlugin.decorations).map(({ from, to }) => ({ from, to })),
      ).toStrictEqual(decorationRanges)
    })
  })

  describe("update", () => {
    it("doesn't update decorations when doc and viewport unchanged", () => {
      const initialView = FakeEditorView.create({ state, visibleRanges: [{ from: 0, to: 16 }] })

      const viewUpdate = FakeViewUpdate.create({
        view: FakeEditorView.create(),
        docChanged: false,
        viewportChanged: false,
      })

      const viewPlugin = ViewPluginValue.create({ view: initialView })
      viewPlugin.update(viewUpdate)
      expect(
        RangeSets.getRanges(viewPlugin.decorations).map(({ from, to }) => ({ from, to })),
      ).toStrictEqual(decorationRanges)
    })

    it("updates decorations", () => {
      const viewUpdate = FakeViewUpdate.create({
        view: FakeEditorView.create({ state, visibleRanges: [{ from: 0, to: 16 }] }),
        docChanged: true,
      })

      const viewPlugin = ViewPluginValue.create({ view: FakeEditorView.create() })
      viewPlugin.update(viewUpdate)
      expect(
        RangeSets.getRanges(viewPlugin.decorations).map(({ from, to }) => ({ from, to })),
      ).toStrictEqual(decorationRanges)
    })
  })
})

const state = InlineState`
  ~~~lang
  code
  ~~~
`

const decorationRanges = [
  {
    from: 0,
    to: 0,
  },
  {
    from: 0,
    to: 7,
  },
  {
    from: 8,
    to: 8,
  },
  {
    from: 13,
    to: 13,
  },
  {
    from: 13,
    to: 16,
  },
]
