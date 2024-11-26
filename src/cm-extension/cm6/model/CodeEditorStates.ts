import { EditorState } from "@codemirror/state"

import { Extensions } from "@cm-extension/cm6/Extensions"
import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { Config } from "@cm-extension/cm6/model/Config"
import { ConfigFacet } from "@cm-extension/cm6/state/ConfigFacet"

/**
 * Operations on {@link BetterCodeBlocks} within {@link EditorState}s .
 */
export namespace CodeEditorStates {
  /**
   * Returns the {@link Config} within the {@link state} as defined by the {@link ConfigFacet}.
   */
  export function getConfig(state: EditorState): Config {
    return state.facet(ConfigFacet)
  }

  /**
   * Returns the {@link CodeBlock}s within the {@link state}
   * as defined by the {@link Extensions.codeBlocksStateField}.
   *
   * Throws an error if {@link Extensions.codeBlocksStateField} isn't registered.
   */
  export function getCodeBlocks(state: EditorState): readonly CodeBlock[] {
    return state.field(Extensions.codeBlocksStateField)
  }
}
