import { EditorSelection, EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"

import { OpeningFenceCursorFilter } from "@cm-extension/cm6/modification/cursor/OpeningFenceCursorFilter"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("OpeningFenceCursorFilter", () => {
  it("does nothing when not after opening fence", () => {
    const startState = InlineState`
      ~~~lang
      ~~~^
    `
    const { selection } = InlineState`
      ~~~lang
      ^~~~
    `

    expect(filteredUpdateOf(startState, selection)).toStrictEqual(selection)
  })

  it("moves cursor to opening fence start when cursor moves vertically", () => {
    const startState = InlineState`
      something^
      ~~~lang
      ~~~
    `
    expect(
      filteredUpdateOf(startState, EditorSelections.singleCursor({ pos: 17, goalColumn: 9 })),
    ).toStrictEqual(EditorSelections.singleCursor({ pos: 10, goalColumn: 9 }))
  })

  it("moves cursor to opening fence start when cursor moves backward", () => {
    const startState = InlineState`
      ~~~lang
      ~~~^
    `
    const { selection: originalSelection } = InlineState`
      ~~~lang^
      ~~~
    `
    const { selection: modifiedSelection } = InlineState`
      ^~~~lang
      ~~~
    `

    expect(filteredUpdateOf(startState, originalSelection)).toStrictEqual(modifiedSelection)
  })

  it("moves cursor to code start when cursor moves forwards", () => {
    const startState = InlineState`
      ^~~~lang
      code
      ~~~
    `
    const { selection: originalSelection } = InlineState`
      ~~~lang^
      code
      ~~~
    `
    const { selection: modifiedSelection } = InlineState`
      ~~~lang
      ^code
      ~~~
    `
    expect(filteredUpdateOf(startState, originalSelection)).toStrictEqual(modifiedSelection)
  })

  it("moves cursor to closing fence end when cursor moves forwards and no code", () => {
    const startState = InlineState`
      ^~~~lang
      ~~~
    `
    const { selection: originalSelection } = InlineState`
      ~~~lang^
      ~~~
    `
    const { selection: modifiedSelection } = InlineState`
      ~~~lang
      ~~~^
    `
    expect(filteredUpdateOf(startState, originalSelection)).toStrictEqual(modifiedSelection)
  })
})

function filteredUpdateOf(
  state: EditorState,
  selection: EditorSelection,
): EditorSelection | undefined {
  return state.update(...OpeningFenceCursorFilter(state.update({ selection }))).selection
}
