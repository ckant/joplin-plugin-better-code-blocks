import { EditorState, TransactionFilterSpec } from "@codemirror/state"

import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"
import { def, nil } from "@ext/stdlib/existence"

/**
 * Returns a new cursor position for the change caused by the {@link transaction} if the cursor
 * should move, or else `undefined`.
 */
export type CursorMover = (transaction: {
  readonly startState: EditorState
  readonly pos: number
  readonly previousPos: number
  readonly isVertical: boolean
}) => number | undefined

/**
 * Transaction filter that (potentially) changes the cursor position inside the `transaction`
 * to a new position provided by the {@link CursorMover}.
 *
 * Useful for skipping the cursor past undesired selection points (e.g. around atomic ranges).
 *
 * If the `transaction` contains a single cursor and the {@link CursorMover} returns a new
 * cursor position, clones the cursor in the `transaction` and sets it to the new location.
 *
 * @see EditorState.transactionFilter
 */
export const CursorMovementFilter = (move: CursorMover): TransactionFilterSpec => {
  return (transaction) => {
    const { selection, startState, docChanged } = transaction

    if (nil(selection) || docChanged) return [transaction]
    if (!EditorSelections.isSingleCursor(selection)) return [transaction]

    const cursor = selection.main
    const newPosition = move({
      startState,
      pos: cursor.head,
      previousPos: startState.selection.main.head,
      isVertical: def(cursor.goalColumn),
    })
    if (nil(newPosition)) return [transaction]

    return [
      transaction,
      {
        selection: EditorSelections.singleCursor({
          pos: newPosition,
          assoc: cursor.assoc,
          bidiLevel: cursor.bidiLevel,
          goalColumn: cursor.goalColumn,
        }),
      },
    ]
  }
}
