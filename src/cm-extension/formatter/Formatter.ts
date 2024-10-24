import { Doc } from "codemirror"

import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { Origin } from "@cm-extension/model/Origin"

/**
 * Modifies the formatting of {@link Doc}s (e.g. spacing).
 */
export interface Formatter {
  /**
   * Formats the {@link codeBlocks} in {@link doc} and returns the formatted {@link CodeBlock}s.
   * The operation executes using the given {@link origin}.
   *
   * e.g. adding spacing to the {@link doc}, changing the position of the {@link codeBlocks}.
   */
  format(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[]
}
export namespace Formatter {
  /**
   * Adapts multiple {@link formatters} into a single {@link Formatter} (applied first to last).
   */
  export function combine(...formatters: readonly Formatter[]): Formatter {
    return {
      format(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
        let formattedCodeBlocks = codeBlocks
        formatters.forEach((it) => {
          formattedCodeBlocks = it.format(doc, formattedCodeBlocks, origin)
        })
        return formattedCodeBlocks
      },
    }
  }
}
