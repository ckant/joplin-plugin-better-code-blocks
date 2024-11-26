import { EditorSelection } from "@codemirror/state"
import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { CursorMovementFilter, CursorMover } from "@ext/codemirror/cm6/state/CursorMovementFilter"
import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("CursorMovementFilter", () => {
  it("does nothing when no selection", () => {
    const transaction = InlineState`test`.update({})

    expect(CursorMovementFilter(mock<CursorMover>())(transaction)).toStrictEqual([transaction])
  })

  it("does nothing when doc changed", () => {
    const transaction = InlineState`test`.update({
      selection: EditorSelections.singleCursor({ pos: 0 }),
      changes: { from: 0, insert: "something" },
    })

    expect(CursorMovementFilter(mock<CursorMover>())(transaction)).toStrictEqual([transaction])
  })

  it("does nothing when selection isn't a single cursor", () => {
    const transaction = InlineState`test`.update({
      selection: EditorSelection.single(0, 1),
    })

    expect(CursorMovementFilter(mock<CursorMover>())(transaction)).toStrictEqual([transaction])
  })

  it("does nothing when cursor mover returns nil ", () => {
    const startState = InlineState`^test`
    const transaction = startState.update({
      selection: EditorSelections.singleCursor({ pos: 1 }),
    })

    const mockCursorMover = mock<CursorMover>()
    when(() =>
      mockCursorMover({ startState, pos: 1, previousPos: 0, isVertical: false }),
    ).thenReturn(undefined)

    expect(CursorMovementFilter(mockCursorMover)(transaction)).toStrictEqual([transaction])
  })

  it("moves cursor", () => {
    const startState = InlineState`^test`
    const transaction = startState.update({
      selection: EditorSelections.singleCursor({ pos: 1 }),
    })

    const mockCursorMover = mock<CursorMover>()
    when(() =>
      mockCursorMover({ startState, pos: 1, previousPos: 0, isVertical: false }),
    ).thenReturn(4)

    expect(
      startState.update(...CursorMovementFilter(mockCursorMover)(transaction)).selection,
    ).toStrictEqual(EditorSelections.singleCursor({ pos: 4 }))
  })
})
