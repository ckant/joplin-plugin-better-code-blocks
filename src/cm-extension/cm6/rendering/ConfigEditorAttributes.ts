import { EditorState } from "@codemirror/state"
import { AttrSource } from "@codemirror/view"

import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"

/**
 * Editor attributes that add Config values to the editor dataset.
 *
 * Used for applying conditional css rules and increasing specificity.
 *
 * @see EditorState.editorAttributes
 */
export function ConfigEditorAttributes(state: EditorState): AttrSource {
  const { cornerStyle, rendering, renderLayout } = CodeEditorStates.getConfig(state)

  return {
    "data-cb-corner-style": cornerStyle,
    "data-cb-rendering": rendering,
    "data-cb-render-layout": renderLayout,
  }
}
