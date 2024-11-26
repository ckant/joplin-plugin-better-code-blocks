import { EditorSelection, EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { AllCodeSelectionFilter } from "@cm-extension/cm6/modification/selection/AllCodeSelectionFilter"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { InlineText } from "test-support/ext/codemirror/cm6/InlineText"
import { Any } from "test-support/fixtures/cm6/Any"

describe("AllCodeSelectionFilter", () => {
  it("does nothing when not select all", () => {
    const startState = InlineState`
      ~~~lang
      ^code
      ~~~
    `
    const { selection } = InlineState`
      ^~~~lang
      code
      ~~$~
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when had multiple selections", () => {
    const startState = Any.stateWith({
      selection: EditorSelection.create([
        EditorSelection.range(0, 7),
        EditorSelection.range(8, 12),
      ]),
      doc: InlineText`
        ~~~lang
        code
        ~~~
      `,
    })

    const { selection } = InlineState`
      ^~~~lang
      code
      ~~~$
    `

    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when not inside code block", () => {
    const startState = InlineState`
      ~~~lang^
      code
      ~~~
    `
    const { selection } = InlineState`
      ^~~~lang
      code
      ~~~$
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when all code already selected", () => {
    const startState = InlineState`
      ~~~lang
      ^code$
      ~~~
    `
    const { selection } = InlineState`
      ^~~~lang
      code
      ~~~$
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("selects all code", () => {
    const startState = InlineState`
      ~~~lang
      ^code
      ~~~
    `
    const { selection: originalSelection } = InlineState`
      ^~~~lang
      code
      ~~~$
    `
    const { selection: modifiedSelection } = InlineState`
      ~~~lang
      ^code$
      ~~~
    `

    expect(filteredUpdateOf(startState, originalSelection)).toStrictEqual(modifiedSelection)
  })
})

function filteredUpdateOf(
  state: EditorState,
  selection: EditorSelection,
): EditorSelection | undefined {
  return state.update(...AllCodeSelectionFilter(state.update({ selection }))).selection
}
