import { LineRef } from "@codemirror/state"

import { Iterables } from "@ext/stdlib/Iterables"

export interface CodeBlockProps {
  readonly openingFence: LineRef
  readonly closingFence: LineRef
  readonly lang: string | undefined
}

/**
 * Represents a markdown fenced code block.
 *
 * - The {@link openingFence} represents the opening line of the fence (including any indent)
 * - The {@link closingFence} represents the closing line of the fence (including any indent)
 * - The {@link lang} represents the (possibly undefined) language tag (e.g. `typescript`)
 *
 * Note that `openingFence.to` and `closingFence.to` represent
 * the doc positions 1 character *after* the text (the ranges are half-open on the right).
 *
 * e.g. given the following markdown fenced code block at the top of a doc:
 *
 * <pre>
 * ~~~typescript
 * console.info("Hello World");
 * ~~~
 * </pre>
 *
 * - the {@link openingFence} is `{ number: 1, from: 0, to: 13, text: "~~~typescript"}`
 * - the {@link closingFence} is `{ number: 3, from: 43, to: 46, text: "~~~"}`
 * - the {@link lang} is `typescript`
 *
 * @see CodeBlockWithCode
 * @see CodeDocs
 * @see https://spec.commonmark.org/0.31.2/#fenced-code-blocks
 */
export class CodeBlock {
  readonly lang: string | undefined

  private readonly openingFence: LineRef
  private readonly closingFence: LineRef

  static of(props: CodeBlockProps): CodeBlock {
    return new CodeBlock(props)
  }

  private constructor({ lang, openingFence, closingFence }: CodeBlockProps) {
    this.openingFence = openingFence
    this.closingFence = closingFence
    this.lang = lang
  }

  /**
   * The start position of the code block.
   */
  get start(): number {
    return this.openingFence.from
  }

  /**
   * The end position of the code block.
   */
  get end(): number {
    return this.closingFence.to
  }

  /**
   * The start position of the opening fence.
   */
  get openingFenceStart(): number {
    return this.openingFence.from
  }

  /**
   * The end position of the opening fence.
   */
  get openingFenceEnd(): number {
    return this.openingFence.to
  }

  /**
   * All text inside the opening fence (including language and any indent).
   */
  get openingFenceText(): string {
    return this.openingFence.text
  }

  /**
   * The start position of the closing fence.
   */
  get closingFenceStart(): number {
    return this.closingFence.from
  }

  /**
   * The end position of the closing fence.
   */
  get closingFenceEnd(): number {
    return this.closingFence.to
  }

  /**
   * All text inside the closing fence (including any indent).
   */
  get closingFenceText(): string {
    return this.closingFence.text
  }

  /**
   * The line number of the opening fence.
   */
  get firstLine(): number {
    return this.openingFence.number
  }

  /**
   * The line number of the closing fence.
   */
  get lastLine(): number {
    return this.closingFence.number
  }

  /**
   * The start position of the code in the code block, or `undefined` if it has no code.
   */
  get codeStart(): number | undefined {
    return this.hasCode() ? this.openingFenceEnd + 1 : undefined
  }

  /**
   * The end position of the code in the code block, or `undefined` if it has no code.
   */
  get codeEnd(): number | undefined {
    return this.hasCode() ? this.closingFenceStart - 1 : undefined
  }

  /**
   * The line number of the first code line in the code block, or `undefined` if it has no code.
   */
  get firstCodeLine(): number | undefined {
    return this.hasCode() ? this.openingFence.number + 1 : undefined
  }

  /**
   * The line number of the last code line in the code block, or `undefined` if it has no code.
   */
  get lastCodeLine(): number | undefined {
    return this.hasCode() ? this.closingFence.number - 1 : undefined
  }

  /**
   * The total number of code lines in the code block.
   */
  get codeLineCount(): number {
    return this.closingFence.number - this.openingFence.number - 1
  }

  /**
   * Returns an {@link Iterable} over each line number in the code block.
   */
  get codeLines(): Iterable<number> {
    return this.hasCode()
      ? Iterables.range({ start: this.firstCodeLine, endExclusive: this.lastCodeLine + 1 })
      : Iterables.empty()
  }

  /**
   * Returns true and narrows `this` to a {@link CodeBlockWithCode} if the code block has code.
   */
  hasCode(): this is CodeBlockWithCode {
    return this.codeLineCount >= 1
  }

  /**
   * Returns true if the code block contains (or is exactly represented by) the given range.
   *
   * If {@link includeFences} is true,
   * checks for the given range within the entire code block.
   *
   * If {@link includeFences} is false,
   * checks for the range for within the code lines of the code block, if any.
   */
  includesRange(
    { from, to }: { from: number; to: number },
    { includeFences }: { includeFences: boolean },
  ): boolean {
    if (includeFences) return from >= this.start && to <= this.end

    if (!this.hasCode()) return false
    return from >= this.codeStart && to <= this.codeEnd
  }

  /**
   * Returns true if the code block is exactly represented by the given range.
   *
   * If {@link includeFences} is true,
   * matches the given range against the entire code block.
   *
   * If {@link includeFences} is false,
   * matches the given range against the code lines of the code block, if any.
   */
  isExactRange(
    { from, to }: { from: number; to: number },
    { includeFences }: { includeFences: boolean },
  ): boolean {
    if (includeFences) return from === this.start && to === this.end

    if (!this.hasCode()) return false
    return from === this.codeStart && to === this.codeEnd
  }

  /**
   * Returns true if the code block overlaps (or is exactly represented by) the given range.
   *
   * If {@link includeFences} is true,
   * checks whether the given range overlaps any of the code block.
   *
   * If {@link includeFences} is false,
   * checks whether the given range overlaps any of the code lines of the code block, if any.
   */
  touchesRange(
    { from, to }: { from: number; to: number },
    { includeFences }: { includeFences: boolean },
  ): boolean {
    if (includeFences) return !(to < this.start || from > this.end)

    if (!this.hasCode()) return false
    return !(to < this.codeStart || from > this.codeEnd)
  }
}

/**
 * Represents a markdown fenced code block that definitely has code inside.
 *
 * Narrows {@link CodeBlock} to never return `undefined` for properties that act on `code`.
 *
 * @see CodeBlock
 */
export interface CodeBlockWithCode extends CodeBlock {
  /**
   * The start position of the code in the code block.
   */
  get codeStart(): number

  /**
   * The line number of the first code line in the code block.
   */
  get firstCodeLine(): number

  /**
   * The line number of the last code line in the code block.
   */
  get lastCodeLine(): number

  /**
   * The end position of the code in the code block.
   */
  get codeEnd(): number
}
