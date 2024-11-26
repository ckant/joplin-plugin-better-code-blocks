import { ChangeSet, TransactionFilterSpec } from "@codemirror/state"

import { Transactions } from "@ext/codemirror/cm6/state/Transactions"

import { CodeBlockWithCode } from "@cm-extension/cm6/model/CodeBlock"
import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

/**
 * Transaction filter that prevents deletion of the line breaks immediately before the first code
 * line and after the last code line in a code block.
 *
 * This prevents accidental merging of a fence line with a code line.
 *
 * e.g. given the following code block
 *
 * <pre>
 * ~~~
 * cursorBeforeThis
 * cursorAfterThis
 * ~~~
 * </pre>
 *
 * Pressing `backspace` with the cursor before `cursorBeforeThis` would normally result in
 *
 * <pre>
 * ~~~cursorBeforeThis
 * cursorAfterThis
 * ~~~
 * </pre>
 *
 * And pressing `delete` with the cursor after `cursorAfterThis` would normally result in
 *
 * <pre>
 * ~~~
 * cursorBeforeThis
 * cursorAfterThis~~~
 * </pre>
 *
 * This transaction filter prevents this from occurring and makes it easier to edit the code
 * inside the code block without worrying about messing up the fences.
 *
 * @see EditorState.transactionFilter
 */
export const FenceLineBreakDeleteFilter: TransactionFilterSpec = (transaction) => {
  if (!Transactions.isDeleteDirection(transaction)) return [transaction]

  const { startState, changes } = transaction

  const doesEscapeCodeBlock = CodeEditorStates.getCodeBlocks(startState).some(
    (codeBlock) => codeBlock.hasCode() && removesFenceLineBreak(changes, codeBlock),
  )
  if (!doesEscapeCodeBlock) return [transaction]

  return [{}]
}

function removesFenceLineBreak(
  changes: ChangeSet,
  { codeStart, codeEnd, openingFenceEnd, closingFenceStart }: CodeBlockWithCode,
): boolean {
  return (
    changes.touchesRange(codeStart, openingFenceEnd) === "cover" ||
    changes.touchesRange(closingFenceStart, codeEnd) === "cover"
  )
}
