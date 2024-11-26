import { CursorMovementFilter } from "@ext/codemirror/cm6/state/CursorMovementFilter"
import { nil } from "@ext/stdlib/existence"

import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

/**
 * Transaction filter that "pushes" the cursor out of the position
 * at the end of the opening fence.
 *
 * The cursor skips over this position during horizontal and vertical movement.
 *
 * This makes it easier to select and move the cursor around the code block while maintaining a
 * "border" at the start of the opening fence for adding /removing line breaks.
 *
 * @see ClosingFenceCursorFilter
 * @see CursorMovementFilter
 * @see EditorState.transactionFilter
 */
export const OpeningFenceCursorFilter = CursorMovementFilter((transaction) => {
  const { startState, pos, previousPos, isVertical } = transaction
  const codeBlockWithUnwantedCursor = CodeEditorStates.getCodeBlocks(startState).find(
    (it) => pos === it.openingFenceEnd,
  )

  if (nil(codeBlockWithUnwantedCursor)) return undefined

  const { openingFenceStart, codeStart, closingFenceEnd } = codeBlockWithUnwantedCursor
  return isVertical || pos <= previousPos ? openingFenceStart : (codeStart ?? closingFenceEnd)
})
