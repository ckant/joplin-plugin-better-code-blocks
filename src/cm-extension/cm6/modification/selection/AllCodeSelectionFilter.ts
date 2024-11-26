import { TransactionFilterSpec } from "@codemirror/state"

import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"
import { Transactions } from "@ext/codemirror/cm6/state/Transactions"
import { nil } from "@ext/stdlib/existence"

import { CodeBlockWithCode } from "@cm-extension/cm6/model/CodeBlock"
import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

/**
 * Transaction filter that shrinks the selection to select the code block code if the cursor
 * is inside the code fence and the {@link transaction} is due to a `Select All` action.
 *
 * This "captures" the `Select All` action to simplify code block selection.
 *
 * If the code block is already selected, lets the `Select All` go through unchanged.
 * This allows the user to perform `Select All` twice to perform a true `Select All` action.
 *
 * @see EditorState.transactionFilter
 */
export const AllCodeSelectionFilter: TransactionFilterSpec = (transaction) => {
  if (!Transactions.isSelectAll(transaction)) return [transaction]

  const { startState } = transaction
  if (EditorSelections.isMultiple(startState.selection)) return [transaction]
  const startRange = startState.selection.main

  const activeCodeBlock = CodeEditorStates.getCodeBlocks(startState).find((codeBlock) =>
    codeBlock.includesRange(startRange, { includeFences: false }),
  ) as CodeBlockWithCode | undefined

  if (nil(activeCodeBlock)) return [transaction]

  if (activeCodeBlock.isExactRange(startRange, { includeFences: false })) return [transaction]

  return [
    transaction,
    { selection: { anchor: activeCodeBlock.codeStart, head: activeCodeBlock.codeEnd } },
  ]
}
