import { ChangeSpec } from "@codemirror/state"
import { UpdateListenerSpec, ViewUpdate } from "@codemirror/view"
import { Arrays } from "@ts-belt"

import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

/**
 * Update listener that inserts a line break into each empty code block to create a code line.
 *
 * e.g. the following empty code block:
 *
 * <pre>
 * ~~~typescript
 * ~~~
 * </pre>
 *
 * is "opened", allowing the user to move the cursor inside:
 *
 * <pre>
 * ~~~typescript
 *
 * ~~~
 * </pre>
 *
 * @see EditorView.updateListener
 */
export const EmptyCodeBlockUpdater: UpdateListenerSpec = ({
  docChanged,
  state,
  view,
}: ViewUpdate) => {
  if (!docChanged) return

  const changes: ChangeSpec[] = CodeEditorStates.getCodeBlocks(state)
    .filter((it) => !it.hasCode())
    .map((it) => ({ from: it.openingFenceEnd, insert: state.lineBreak }))

  if (Arrays.isNotEmpty(changes)) view.dispatch({ changes })
}
