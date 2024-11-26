import { TransactionFilterSpec } from "@codemirror/state"

import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"
import { nil } from "@ext/stdlib/existence"

import { CodeBlockWithCode } from "@cm-extension/cm6/model/CodeBlock"
import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

/**
 * Transaction filter that shrinks the selection to the last code line's code if
 * the {@link transaction} selects the entire last code line and the following line break.
 *
 * This can happen due to triple-clicking the last code line to select its contents.
 *
 * Shrinking prevents accidental merging of a fence line with a code line.
 *
 * e.g. given the following code block
 *
 * <pre>
 * ~~~
 * some code
 * tripleClickLine
 * ~~~
 * </pre>
 *
 * Triple-clicking the `tripleClickLine` would normally select both
 * the line itself *and* the following line break.
 * Pressing backspace after triple-clicking the line would normally result in
 *
 * <pre>
 * ~~~
 * some code~~~
 * </pre>
 *
 * This transaction filter prevents this from occurring and makes it easier to edit the code
 * inside the code block without worrying about messing up the fences.
 *
 * The selection shrinks to exclude the line break and results in the following
 *
 * <pre>
 * ~~~
 * some code
 * ~~~
 * </pre>
 *
 * @see EditorState.transactionFilter
 */
export const LastCodeLineSelectionFilter: TransactionFilterSpec = (transaction) => {
  const { selection, docChanged, startState } = transaction

  if (docChanged || nil(selection)) return [transaction]
  if (EditorSelections.isMultiple(selection) || selection.main.empty) return [transaction]

  const range = selection.main

  const activeCodeBlock = CodeEditorStates.getCodeBlocks(startState).find(
    (it) => it.hasCode() && it.includesRange(range, { includeFences: true }),
  ) as CodeBlockWithCode | undefined
  if (nil(activeCodeBlock)) return [transaction]

  const lastCodeLine = startState.doc.line(activeCodeBlock.lastCodeLine)

  if (range.from !== lastCodeLine.from || range.to !== lastCodeLine.to + 1) return [transaction]

  return [transaction, { selection: { anchor: lastCodeLine.from, head: lastCodeLine.to } }]
}
