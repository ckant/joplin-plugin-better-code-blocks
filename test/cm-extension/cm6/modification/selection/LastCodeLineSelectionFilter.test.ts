import { EditorSelection, EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { LastCodeLineSelectionFilter } from "@cm-extension/cm6/modification/selection/LastCodeLineSelectionFilter"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { InlineText } from "test-support/ext/codemirror/cm6/InlineText"
import { Any } from "test-support/fixtures/cm6/Any"

describe("LastCodeLineSelectionFilter", () => {
  it("does nothing when doc changed", () => {
    const startState = InlineState`
      ~~~lang
      ^code
      ~~~
    `
    const { selection } = InlineState`
      ^~~~lang
      1337
      ~~~$
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when selection not changed", () => {
    const startState = InlineState`
      ~~~lang
      ^code
      ~~~
    `
    const { selection } = InlineState`
      ~~~lang
      ^code
      ~~~$
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when has multiple selections", () => {
    const startState = InlineState`
      ~~~lang
      code
      ~~~
    `

    const { selection } = Any.stateWith({
      selection: EditorSelection.create([
        EditorSelection.range(0, 7),
        EditorSelection.range(8, 13),
      ]),
      doc: InlineText`
        ~~~lang
        code
        ~~~
      `,
    })

    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when cursor", () => {
    const startState = InlineState`
      ~~~lang
      code
      ~~~
    `
    const { selection } = InlineState`
      ~~~lang
      ^code
      ~~~
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when no code", () => {
    const startState = InlineState`
      ~~~lang
      ~~~
    `
    const { selection } = InlineState`
      ^~~~lang
      ~~~$
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when not inside code block", () => {
    const startState = InlineState`
      something
      ~~~lang
      code
      ~~~
    `
    const { selection } = InlineState`
      ^something$
      ~~~lang
      code
      ~~~
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("does nothing when selection isn't exactly the last code line and following line break", () => {
    const startState = InlineState`
      ~~~lang
      code
      ~~~
    `
    const { selection } = InlineState`
      ~~~lang
      ^code$
      ~~~
    `
    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("selects last code line", () => {
    const startState = InlineState`
      ~~~lang
      code
      ~~~
    `
    const { selection: originalSelection } = InlineState`
      ~~~lang
      ^code
      $~~~
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
  return state.update(...LastCodeLineSelectionFilter(state.update({ selection }))).selection
}
