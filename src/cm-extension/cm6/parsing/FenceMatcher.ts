/**
 * Matches code fences with regular expressions.
 */
export namespace FenceMatcher {
  /**
   * Match the start of an opening code fence.
   *
   * - Start of line
   * - An (optional) indent of 0 to 3 spaces
   * - A mark of 3 or more ~ or \`
   *
   * Adapted from the regex in the CodeMirror markdown mode.
   * Note that this differs slightly from the CommonMark spec.
   *
   * @see https://spec.commonmark.org/0.31.2/#fenced-code-blocks
   */
  export function matchesOpeningFence(text: string): boolean {
    return /^ {0,3}(?:```|~~~)/.test(text)
  }
}
