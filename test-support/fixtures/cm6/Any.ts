import { markdown } from "@codemirror/lang-markdown"
import { EditorState, EditorStateConfig } from "@codemirror/state"

import { Extensions } from "@cm-extension/cm6/Extensions"
import { Config } from "@cm-extension/cm6/model/Config"

type New<T> = () => T

/**
 * Test fixtures for use when any instance will suffice.
 *
 * i.e. when the assertions in the test aren't dependent on the particulars of the instance.
 */
export namespace Any {
  export const stateWith: (
    stateConfig?: Omit<EditorStateConfig, "extensions"> & { config?: Config },
  ) => EditorState = (stateConfig) =>
    EditorState.create({
      doc: stateConfig?.doc,
      selection: stateConfig?.selection,
      extensions: [
        Extensions.codeBlocksStateField,
        Extensions.configFacetOf(stateConfig?.config ?? Config.createDefault()),
        markdown(),
        EditorState.allowMultipleSelections.of(true),
      ],
    })

  export const state: New<EditorState> = () => stateWith()
}
