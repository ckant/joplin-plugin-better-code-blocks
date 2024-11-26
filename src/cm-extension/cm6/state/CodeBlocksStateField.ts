import { EditorState, StateFieldSpec, Transaction } from "@codemirror/state"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeBlocksParser } from "@cm-extension/cm6/parsing/CodeBlocksParser"

/**
 * State field that stores {@link CodeBlock}s.
 */
export const CodeBlocksStateField: StateFieldSpec<readonly CodeBlock[]> = {
  /**
   * Parses and returns {@link CodeBlock}s in the given {@link state}.
   */
  create(state: EditorState): readonly CodeBlock[] {
    return CodeBlocksParser.parse(state)
  },
  /**
   * Parses and returns {@link CodeBlock}s in the given {@link state} when {@link docChanged}.
   */
  update(oldValue: readonly CodeBlock[], { docChanged, state }: Transaction): readonly CodeBlock[] {
    if (!docChanged) return oldValue

    return CodeBlocksParser.parse(state)
  },
}
