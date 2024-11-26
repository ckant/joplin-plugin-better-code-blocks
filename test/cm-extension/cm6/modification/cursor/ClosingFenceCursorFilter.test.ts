import { EditorSelection, EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"

import { ClosingFenceCursorFilter } from "@cm-extension/cm6/modification/cursor/ClosingFenceCursorFilter"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("ClosingFenceCursorFilter", () => {
  it("does nothing when not before closing fence", () => {
    const startState = InlineState`
      ^~~~lang
      ~~~
    `
    const { selection } = InlineState`
      ~~~lang^
      ~~~
    `

    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("moves cursor to closing fence end when cursor moves vertically", () => {
    const startState = InlineState`
      ~~~lang
      ~~~
      ^
    `

    expect(
      filteredUpdateOf(startState, EditorSelections.singleCursor({ pos: 8, goalColumn: 0 })),
    ).toStrictEqual(EditorSelections.singleCursor({ pos: 11, goalColumn: 0 }))
  })

  it("moves cursor to closing fence end when cursor moves forward", () => {
    const startState = InlineState`
      ^~~~lang
      ~~~
    `
    const { selection: originalSelection } = InlineState`
      ~~~lang
      ^~~~
    `
    const { selection: modifiedSelection } = InlineState`
      ~~~lang
      ~~~^
    `

    expect(filteredUpdateOf(startState, originalSelection)).toStrictEqual(modifiedSelection)
  })

  it("moves cursor to code end when cursor moves backwards", () => {
    const startState = InlineState`
      ~~~lang
      code
      ~~~^
    `
    const { selection: originalSelection } = InlineState`
      ~~~lang
      code
      ^~~~
    `
    const { selection: modifiedSelection } = InlineState`
      ~~~lang
      code^
      ~~~
    `

    expect(filteredUpdateOf(startState, originalSelection)).toStrictEqual(modifiedSelection)
  })

  it("moves cursor to opening fence start when cursor moves backwards and no code", () => {
    const startState = InlineState`
      ~~~lang
      ~~~^
    `
    const { selection: originalSelection } = InlineState`
      ~~~lang
      ^~~~
    `
    const { selection: modifiedSelection } = InlineState`
      ^~~~lang
      ~~~
    `

    expect(filteredUpdateOf(startState, originalSelection)).toStrictEqual(modifiedSelection)
  })
})

function filteredUpdateOf(
  state: EditorState,
  selection: EditorSelection,
): EditorSelection | undefined {
  return state.update(...ClosingFenceCursorFilter(state.update({ selection }))).selection
}
