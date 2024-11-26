import { RangeSetBuilder, RangeValue } from "@codemirror/state"
import { AtomicRangesSpec } from "@codemirror/view"

import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

const NoRangeValue = new (class extends RangeValue {})()

/**
 * Provides atomic ranges over the opening and closing fences of all code blocks.
 *
 * This causes the editor to treat fences as single units of text when it comes to
 * cursor movement, deletion, and other operations.
 *
 * Note that most examples show atomic ranges built directly from decorations.
 * This is intentionally separate here since the code block decorations represent
 * a subset of these atomic ranges that have additional filtering for rendering purposes.
 *
 * @see EditorView.atomicRanges
 */
export const CodeFenceAtomicRanges: AtomicRangesSpec = ({ state }) => {
  const builder = new RangeSetBuilder<RangeValue>()
  for (const codeBlock of CodeEditorStates.getCodeBlocks(state)) {
    builder.add(codeBlock.openingFenceStart, codeBlock.openingFenceEnd, NoRangeValue)
    builder.add(codeBlock.closingFenceStart, codeBlock.closingFenceEnd, NoRangeValue)
  }
  return builder.finish()
}
