import { describe, expect, it } from "vitest"

import { EmptyCodeBlockUpdater } from "@cm-extension/cm6/modification/formatting/EmptyCodeBlockUpdater"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"
import { FakeViewUpdate } from "test-support/fakes/codemirror/cm6/view/FakeViewUpdate"

describe("EmptyCodeBlockUpdater", () => {
  it("does nothing when doc is unchanged", () => {
    const viewUpdate = FakeViewUpdate.create({ docChanged: false })

    EmptyCodeBlockUpdater(viewUpdate)
  })

  it("does nothing when no code blocks are empty", () => {
    const viewUpdate = FakeViewUpdate.create({
      docChanged: true,
      state: InlineState`
        ~~~lang
        code
        ~~~
      `,
    })
    EmptyCodeBlockUpdater(viewUpdate)
  })

  it("dispatches line breaks for empty code blocks", () => {
    const view = FakeEditorView.create()
    const viewUpdate = FakeViewUpdate.create({
      docChanged: true,
      state: InlineState`
        ~~~lang
        ~~~
        ~~~lang
        
        ~~~
        ~~~~lang
        ~~~~
      `,
      view,
    })

    EmptyCodeBlockUpdater(viewUpdate)
    expect(view.ext.dispatches).toStrictEqual([
      {
        changes: [
          { from: 7, insert: "\n" },
          { from: 33, insert: "\n" },
        ],
      },
    ])
  })
})
