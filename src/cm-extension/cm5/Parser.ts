import { ReadonlyDoc } from "codemirror"
import { Strings } from "@ts-belt"

import { Docs } from "@ext/codemirror/cm5/Docs"
import { LineSegment } from "@ext/codemirror/cm5/LineSegment"
import { def, nil } from "@ext/stdlib/existence"

import { Matcher } from "@cm-extension/cm5/Matcher"
import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"

/**
 * @see Docs#eachLine
 */
export type EachLine = typeof Docs.eachLine

/**
 * Parses {@link CodeBlock}s from {@link Doc}s using regular expressions.
 *
 * @see Matcher
 */
export class Parser {
  static create(): Parser {
    return new Parser()
  }

  private constructor() {
    // empty
  }

  /**
   * Returns the {@link CodeBlock}s in {@link doc}.
   *
   * Executes a regular expression on each line to find {@link CodeBlock} start and end sequences.
   * If any nested or incomplete code fences exist, returns an empty list.
   *
   * A "nested" code fence is one that contains another code fence within it (i.e. there is another
   * start sequence before the end sequence of the ongoing code fence).
   *
   * e.g. the following nested code fences are invalid:
   * <pre>
   * ~~~typescript
   * ~~~typescript
   * ~~~
   * ~~~
   * </pre>
   *
   * A code fence is incomplete when it has no end.
   *
   * e.g. the following doc is invalid:
   * <pre>
   * ~~~
   * ~~~
   * ~~~
   * </pre>
   *
   * Note that parsing happens from top to bottom, so the last open code fence is the one
   * considered to be incomplete here.
   *
   * Incomplete code fences are technically allowed by the CommonMark spec as well as
   * CodeMirror (they extend until the end of the document), however it makes a lot more sense
   * to require complete code fences for rendering purposes.
   *
   * There may be more than one nested/incomplete code fence in the {@link doc}, but the
   * parsing stops after encountering the first issue.
   */
  parse(doc: ReadonlyDoc): readonly CodeBlock[] {
    return this.parseInternal(doc, Docs.eachLine)
  }

  /**
   * Returns the {@link CodeBlock}s in {@link doc}, same as {@link parse}, except
   * uses {@link eachLine} instead of iterating the {@link doc} directly.
   *
   * @see parse
   */
  parseBy(doc: ReadonlyDoc, eachLine: EachLine): readonly CodeBlock[] {
    return this.parseInternal(doc, eachLine)
  }

  private parseInternal(doc: ReadonlyDoc, eachLine: EachLine): readonly CodeBlock[] {
    const codeBlocks: CodeBlock[] = []
    let start: StartSequence | undefined

    eachLine(doc, ({ line, text, endIteration }) => {
      if (nil(start)) {
        start = this.parseStartSequence(text, line)
        return
      }

      const end = this.parseEndSequence(text, line, start)
      if (nil(end)) {
        const hasNestedCodeBlock = def(this.parseStartSequence(text, line))
        if (hasNestedCodeBlock) endIteration()
        return
      }

      codeBlocks.push(
        CodeBlock.of({
          lang: start.lang,
          start: LineSegment.of({ line: start.line, from: 0, to: start.length }),
          end: LineSegment.of({ line: end.line, from: 0, to: end.length }),
          openingFence: start.sequence,
          closingFence: text,
        }),
      )

      start = undefined
    })

    const hasIncompleteCodeBlock = def(start)
    if (hasIncompleteCodeBlock) return []
    return codeBlocks
  }

  private parseStartSequence(text: string, line: number): StartSequence | undefined {
    const match = Matcher.matchStart(text)
    if (nil(match)) return undefined

    const { tag, sequence } = match
    const lang = Strings.isEmpty(match.lang) ? undefined : match.lang

    return { line, length: text.length, tag, lang, sequence }
  }

  private parseEndSequence(
    text: string,
    line: number,
    { tag }: StartSequence,
  ): EndSequence | undefined {
    if (!Matcher.matchesEnd({ tag, text })) return undefined

    return { line, length: text.length }
  }
}

interface StartSequence {
  readonly line: number
  readonly length: number

  readonly tag: string
  readonly lang: string | undefined
  readonly sequence: string
}

interface EndSequence {
  readonly line: number
  readonly length: number
}
