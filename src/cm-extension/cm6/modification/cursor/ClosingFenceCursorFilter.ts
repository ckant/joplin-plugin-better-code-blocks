import { CursorMovementFilter } from "@ext/codemirror/cm6/state/CursorMovementFilter"
import { nil } from "@ext/stdlib/existence"

import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

/**
 * Transaction filter that "pushes" the cursor out of the position
 * at the start of the closing fence.
 *
 * The cursor skips over this position during horizontal and vertical movement.
 *
 * This makes it easier to select and move the cursor around the code block while maintaining a
 * "border" at the end of the closing fence for adding /removing line breaks.
 *
 * @see OpeningFenceCursorFilter
 * @see CursorMovementFilter
 * @see EditorState.transactionFilter
 */
export const ClosingFenceCursorFilter = CursorMovementFilter((transaction) => {
  const { startState, pos, previousPos, isVertical } = transaction
  const codeBlockWithUnwantedCursor = CodeEditorStates.getCodeBlocks(startState).find(
    (it) => pos === it.closingFenceStart,
  )

  if (nil(codeBlockWithUnwantedCursor)) return undefined

  const { codeEnd, openingFenceStart, closingFenceEnd } = codeBlockWithUnwantedCursor
  return isVertical || pos >= previousPos ? closingFenceEnd : (codeEnd ?? openingFenceStart)
})
