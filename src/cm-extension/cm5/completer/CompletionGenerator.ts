import { Position, ReadonlyDoc } from "codemirror"
import { Arrays } from "@ts-belt"

import { Docs } from "@ext/codemirror/cm5/Docs"
import { nil } from "@ext/stdlib/existence"

import { Matcher } from "@cm-extension/cm5/Matcher"
import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { EachLine, Parser } from "@cm-extension/cm5/Parser"

export interface CompletionGeneratorProps {
  readonly parser: Parser
}

/**
 * Generates autocompletions for code fences (end tags) using the given {@link parser}.
 *
 * e.g. given the following incomplete code fence (with the cursor at the end of the line):
 * <pre>
 * ~~~typescript
 * </pre>
 *
 * the completion is `~~~`.
 */
export class CompletionGenerator {
  private readonly parser: Parser

  static create(props: CompletionGeneratorProps): CompletionGenerator {
    return new CompletionGenerator(props)
  }

  private constructor(props: CompletionGeneratorProps) {
    this.parser = props.parser
  }

  /**
   * Generates an autocompletion for an "incomplete" code fence in the given {@link doc} (if one exists).
   *
   * The following conditions must be true to generate a completion:
   * - The cursor is at the end of the start tag line.
   * - The {@link parser} returns no {@link CodeBlock}s (always true when
   * there's an incomplete code fence).
   * - Application of the completion results in a new {@link CodeBlock} that matches
   * the incomplete code fence (prevents unintentional completion off of an end tag).
   * - Application of the completion causes the {@link parser} to return
   * some {@link CodeBlock}s (true when there are no other incomplete code fences).
   *
   * These requirements prevent ambiguous situations where the user may not want a completion.
   *
   * Per the code fence specification, the completion (if one exists) end tag matches that of
   * the start tag and has the same indentation.
   * @see https://spec.commonmark.org/0.30/#fenced-code-blocks
   */
  generate(doc: ReadonlyDoc): string | undefined {
    const cursor = doc.getCursor()
    const cursorLine = doc.getLine(cursor.line)
    if (cursor.ch < cursorLine.length) return undefined

    const startSequence = Matcher.matchStart(cursorLine)
    if (nil(startSequence) || !this.isCompletionPossible(doc)) return undefined

    const endSequence = `${startSequence.indent}${startSequence.tag}`
    if (!this.isCompletionValid(doc, endSequence, cursor)) return undefined

    return endSequence
  }

  private isCompletionPossible(doc: ReadonlyDoc): boolean {
    // If the parser returns code blocks, no incomplete code blocks exist
    return Arrays.isEmpty(this.parser.parse(doc))
  }

  private isCompletionValid(doc: ReadonlyDoc, completion: string, cursor: Position): boolean {
    // Only allow a completion that (exactly) represents a new code block
    const newCodeBlocks = this.parseCodeBlocksWithCompletion(doc, completion, cursor)
    return newCodeBlocks.some((it) => it.startsAt(cursor.line) && it.endsAt(cursor.line + 1))
  }

  private parseCodeBlocksWithCompletion(
    doc: ReadonlyDoc,
    completion: string,
    cursor: Position,
  ): readonly CodeBlock[] {
    return this.parser.parseBy(doc, this.eachLineWithCompletion(completion, cursor))
  }

  private eachLineWithCompletion(completion: string, cursor: Position): EachLine {
    return (theDoc, fn) => {
      Docs.eachLineInserting(theDoc, { line: cursor.line + 1, text: completion }, fn)
    }
  }
}
