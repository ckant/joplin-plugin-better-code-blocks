import { Text } from "@codemirror/state"

import { Iterables } from "@ext/stdlib/Iterables"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"

/**
 * Operations on {@link CodeBlock}s within docs.
 */
export namespace CodeDocs {
  /**
   * Returns the `code` within the given {@link codeBlock} in the {@link doc}.
   * This may optionally {@link includeFences} of the {@link codeBlock}.
   */
  export function getCode(
    doc: Text,
    codeBlock: CodeBlock,
    options: { includeFences: boolean },
  ): string {
    if (options.includeFences) return doc.sliceString(codeBlock.start, codeBlock.end)

    if (!codeBlock.hasCode()) return ""

    return doc.sliceString(codeBlock.codeStart, codeBlock.codeEnd)
  }

  /**
   * Returns an {@link Iterable} over the lines of the given {@link codeBlock} in the {@link doc}.
   * This may optionally {@link includeFences} of the {@link codeBlock}.
   *
   * Doesn't return the line breaks and yields empty strings for empty lines.
   *
   * @see Text.iterLines
   */
  export function iterCodeLines(
    doc: Text,
    codeBlock: CodeBlock,
    options: { includeFences: boolean },
  ): Iterable<string> {
    if (options.includeFences) return doc.iterLines(codeBlock.firstLine, codeBlock.lastLine + 1)

    if (!codeBlock.hasCode()) return Iterables.empty()

    return doc.iterLines(codeBlock.firstCodeLine, codeBlock.lastCodeLine + 1)
  }
}
