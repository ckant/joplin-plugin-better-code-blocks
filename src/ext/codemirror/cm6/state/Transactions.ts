import { Transaction } from "@codemirror/state"

import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"
import { UserEvent } from "@ext/codemirror/cm6/state/UserEvent"
import { nil } from "@ext/stdlib/existence"

/**
 * Operations on {@link Transaction}s.
 */
export namespace Transactions {
  /**
   * Returns true if the {@link transaction} is due to the user pressing backspace.
   */
  export function isDeleteBackward(transaction: Transaction): boolean {
    return transaction.isUserEvent(UserEvent.deleteBackward)
  }

  /**
   * Returns true if the {@link transaction} is due to the user pressing delete.
   */
  export function isDeleteForward(transaction: Transaction): boolean {
    return transaction.isUserEvent(UserEvent.deleteForward)
  }

  /**
   * Returns true if the {@link transaction} is due to the user pressing backspace or delete.
   */
  export function isDeleteDirection(transaction: Transaction): boolean {
    return isDeleteBackward(transaction) || isDeleteForward(transaction)
  }

  /**
   * Returns true if the {@link transaction} is due to the user performing select-all.
   */
  export function isSelectAll(transaction: Transaction): boolean {
    const { selection, docChanged, startState } = transaction

    if (docChanged) return false
    if (nil(selection) || EditorSelections.isMultiple(selection)) return false

    const { main: range } = selection
    return range.from === 0 && range.to === startState.doc.length
  }
}
