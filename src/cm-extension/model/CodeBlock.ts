import { LineSegment } from "@ext/codemirror/LineSegment"
import { Require } from "@ext/stdlib/Require"

export interface CodeBlockProps {
  readonly start: LineSegment
  readonly end: LineSegment
  readonly lang: string | undefined
  readonly openingFence: string
  readonly closingFence: string
}

/**
 * Represents a markdown fenced code block.
 *
 * e.g.
 *
 * <pre>
 * ~~~typescript
 * console.info("Hello World");
 * ~~~
 * </pre>
 *
 * - The {@link start} represents the opening line of the fence (e.g. line 0, from char 0 to 13)
 * - The {@link end} represents the closing line of the fence (e.g. line 2, from char 0 to 3)
 * - The {@link lang} represents the (possibly undefined) language tag (e.g. `typescript`)
 * - The {@link openingFence} represents the opening fence (e.g. `~~~typescript`)
 * - The {@link closingFence} represents the closing fence (e.g. `~~~`)
 *
 * @see Matcher
 * @see CodeDocs
 * @see https://spec.commonmark.org/0.30/#fenced-code-blocks
 */
export class CodeBlock {
  readonly start: LineSegment
  readonly end: LineSegment
  readonly lang: string | undefined
  readonly openingFence: string
  readonly closingFence: string

  static of(props: CodeBlockProps): CodeBlock {
    return new CodeBlock(props)
  }

  private constructor({ start, end, lang, openingFence, closingFence }: CodeBlockProps) {
    this.start = start
    this.end = end
    this.lang = lang
    this.openingFence = openingFence
    this.closingFence = closingFence
  }

  /**
   * The opening line number of the fence.
   */
  get startLine(): number {
    return this.start.line
  }

  /**
   * The closing line number of the fence.
   */
  get endLine(): number {
    return this.end.line
  }

  /**
   * Returns a new code block shifted down by the given {@link lineCount}.
   */
  shiftDownBy(lineCount: number): CodeBlock {
    Require.integer(lineCount)

    return CodeBlock.of({
      start: this.start.plusLines(lineCount),
      end: this.end.plusLines(lineCount),
      lang: this.lang,
      openingFence: this.openingFence,
      closingFence: this.closingFence,
    })
  }

  /**
   * Returns true if the code block ends strictly before the given {@link line}.
   *
   * The {@link line} must be a non-negative integer.
   */
  isBefore(line: number): boolean {
    Require.nonNegativeInteger(line)

    return this.endLine < line
  }

  /**
   * Returns true if the code block starts strictly after the given {@link line}.
   *
   * The {@link line} must be a non-negative integer.
   */
  isAfter(line: number): boolean {
    Require.nonNegativeInteger(line)

    return this.startLine > line
  }

  /**
   * Returns true if the code block starts exactly on the given {@link line}.
   *
   * The {@link line} must be a non-negative integer.
   */
  startsAt(line: number): boolean {
    Require.nonNegativeInteger(line)

    return this.startLine === line
  }

  /**
   * Returns true if the code block ends exactly on the given {@link line}.
   *
   * The {@link line} must be a non-negative integer.
   */
  endsAt(line: number): boolean {
    Require.nonNegativeInteger(line)

    return this.endLine === line
  }

  /**
   * Returns true if the code block overlaps the given {@link line}.
   * This check may optionally {@link includeFences} of the code block.
   *
   * The {@link line} must be a non-negative integer.
   */
  containsLine(line: number, options?: { includeFences: boolean }): boolean {
    Require.nonNegativeInteger(line)

    if (options?.includeFences ?? false) {
      return line >= this.startLine && line <= this.endLine
    } else {
      return line > this.startLine && line < this.endLine
    }
  }

  /**
   * Returns the length of the code block, including the start and end lines.
   */
  get size(): number {
    return this.endLine - this.startLine - 1
  }

  isEmpty(): boolean {
    return this.size === 0
  }

  equals(other: CodeBlock): boolean {
    return (
      this.start.equals(other.start) &&
      this.end.equals(other.end) &&
      this.lang === other.lang &&
      this.openingFence === other.openingFence &&
      this.closingFence === other.closingFence
    )
  }
}
