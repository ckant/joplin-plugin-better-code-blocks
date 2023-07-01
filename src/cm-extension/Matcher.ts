import { nil } from "@ext/stdlib/existence"

/**
 * Matches {@link CodeBlock}s using regular expressions.
 *
 * @see https://spec.commonmark.org/0.30/#fenced-code-blocks
 * @see https://github.com/codemirror/codemirror5/blob/master/mode/markdown/markdown.js
 */
export namespace Matcher {
  /**
   * Matches the start of a CodeMirror code fence.
   *
   * - Start of line
   * - An (optional) `indent` of 0 to 3 spaces or tabs
   * - A `tag` of 3 or more ~ or \`
   * - Any amount of spaces or tabs
   * - The (optional) `lang` consisting of any amount of word characters or /, +, #, -
   * - Any amount of other characters except new lines and \`
   * - End of line
   *
   * Adapted from the regex in the CodeMirror markdown mode.
   * Note that this differs slightly from the CommonMark spec.
   *
   * @see https://github.com/codemirror/codemirror5/blob/master/mode/markdown/markdown.js#L95
   * @see https://spec.commonmark.org/0.30/#fenced-code-blocks
   */
  const codeBlockStart = function (): RegExp {
    return /^(?<indent>[ \t]{0,3})(?<tag>~~~+|```+)[ \t]*(?<lang>[\w/+#-]*)[^\n`]*$/
  }

  /**
   * Matches the end of a CodeMirror code fence.
   *
   * - Start of line
   * - An (optional) indent of 0 to 3 spaces or tabs characters
   * - The start tag with any amount of extra ~ or \` (depending on which the start tag uses)
   * - Any amount of **spaces** (note: doesn't allow tabs here, as the start sequence does)
   * - End of line
   *
   * Adapted from the regex in the CodeMirror markdown mode.
   * Note that this differs slightly from the CommonMark spec.
   *
   * @see https://github.com/codemirror/codemirror5/blob/master/mode/markdown/markdown.js#L240
   * @see https://spec.commonmark.org/0.30/#fenced-code-blocks
   */
  const codeBlockEnd = function (tag: string): RegExp {
    // Note that ${tag}+ translates to ```+ or ~~~+
    return new RegExp(`[ \t]{0,3}${tag}+ *$`)
  }

  /**
   * Checks whether the {@link text} matches the start sequence of a {@link CodeBlock} and, if
   * it does, returns the match's {@link indent}, {@link tag}, {@link lang}, and {@link sequence}.
   *
   * @see codeBlockStart
   */
  export function matchStart(
    text: string,
  ): { indent: string; tag: string; lang: string; sequence: string } | undefined {
    const match = codeBlockStart().exec(text)
    if (nil(match)) return undefined
    return {
      indent: match.groups!.indent,
      tag: match.groups!.tag,
      lang: match.groups!.lang,
      sequence: match[0],
    }
  }

  /**
   * Returns true if the {@link text} matches the end sequence of a {@link CodeBlock} with the
   * given start {@link tag}.
   *
   * @see codeBlockEnd
   */
  export function matchesEnd({ tag, text }: { tag: string; text: string }): boolean {
    return codeBlockEnd(tag).test(text)
  }
}
