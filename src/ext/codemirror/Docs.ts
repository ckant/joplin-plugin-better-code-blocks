import { Doc, LineHandle, Position, ReadonlyDoc } from "codemirror"

import { Positions } from "@ext/codemirror/Positions"
import { Range } from "@ext/codemirror/Range"
import { Require } from "@ext/stdlib/Require"

/**
 * Extensions for {@link Doc}s.
 */
export namespace Docs {
  /**
   * Applies {@link fn} to each line in {@link doc} and returns the results.
   */
  export function mapLines<T>(
    doc: ReadonlyDoc,
    fn: (lineParts: { line: number; text: string }) => T,
  ): readonly T[] {
    const arr: T[] = []
    let line = 0
    eachLine(doc, (it) => {
      arr.push(fn({ line, text: it.text }))
      line++
    })
    return arr
  }

  /**
   * Calls {@link fn} with each line in {@link doc}.
   *
   * Almost the same as {@link ReadonlyDoc#eachLine}, except it allows for "breaking" early.
   *
   * Normally it would be best to use a `for of` loop,
   * but unfortunately {@link ReadonlyDoc} doesn't provide an iterator.
   * Additionally, the docs mention that {@link ReadonlyDoc#eachLine} is the fastest way to iterate.
   */
  export function eachLine(
    doc: ReadonlyDoc,
    fn: (lineParts: { line: number; text: string; endIteration: () => void }) => void,
  ): void {
    let cont = true
    const endIteration: () => void = () => (cont = false)
    let line = 0

    doc.eachLine((it) => {
      if (cont) fn({ line, text: it.text, endIteration })
      line++
    })
  }

  /**
   * Calls {@link fn} with each line in {@link doc} plus an extra {@link insertedLine}.
   *
   * Useful for iterating a hypothetical {@link ReadonlyDoc} that includes {@link insertedLine}
   * without having to copy or modify it (i.e. performing a cheap dry-run of an insert).
   *
   * The {@link insertedLine} must be a non-negative integer.
   */
  export function eachLineInserting(
    doc: ReadonlyDoc,
    { line: insertedLine, text: insertedText }: { line: number; text: string },
    fn: (lineParts: { line: number; text: string; endIteration: () => void }) => void,
  ): void {
    Require.nonNegativeInteger(insertedLine)

    let cont = true
    const endIteration: () => void = () => (cont = false)
    let line = 0

    doc.eachLine((it) => {
      if (cont && line === insertedLine) {
        fn({ line, text: insertedText, endIteration })
        line++
      }

      if (cont) fn({ line, text: it.text, endIteration })
      line++
    })

    if (cont && line === insertedLine) fn({ line, text: insertedText, endIteration })
  }

  /**
   * Inserts a {@link doc#lineSeparator} into {@link doc} at the given {@link pos}.
   * The operation executes using the given {@link origin}.
   *
   * Both {@link pos#line} and {@link pos#ch} must be non-negative integers.
   */
  export function insertNewLine(doc: Doc, pos: Position, origin: string): void {
    Require.nonNegativeInteger(pos.line)
    Require.nonNegativeInteger(pos.ch)

    doc.replaceRange(doc.lineSeparator(), pos, undefined, origin)
  }

  /**
   * Adds all the {@link cssClassNames} to the given {@link line} within {@link doc}.
   * Returns the {@link LineHandle} for the {@link line}.
   *
   * The {@link line} must be a non-negative integer.
   */
  export function addLineClasses(
    doc: Doc,
    line: number,
    cssClassNames: {
      background?: readonly string[]
      text?: readonly string[]
      wrap?: readonly string[]
      gutter?: readonly string[]
    },
  ): LineHandle {
    Require.nonNegativeInteger(line)

    let lineHandle: LineHandle | undefined
    cssClassNames.background?.forEach((it) => {
      lineHandle = doc.addLineClass(line, "background", it)
    })
    cssClassNames.text?.forEach((it) => {
      lineHandle = doc.addLineClass(line, "text", it)
    })
    cssClassNames.wrap?.forEach((it) => {
      lineHandle = doc.addLineClass(line, "wrap", it)
    })
    cssClassNames.gutter?.forEach((it) => {
      lineHandle = doc.addLineClass(line, "gutter", it)
    })

    return lineHandle ?? doc.getLineHandle(line)
  }

  /**
   * Removes all the {@link cssClassNames} from the given {@link line} within {@link doc}.
   */
  export function removeLineClasses(
    doc: Doc,
    line: LineHandle,
    cssClassNames: {
      background?: readonly string[]
      text?: readonly string[]
      wrap?: readonly string[]
      gutter?: readonly string[]
    },
  ): void {
    cssClassNames.background?.forEach((it) => {
      doc.removeLineClass(line, "background", it)
    })
    cssClassNames.text?.forEach((it) => {
      doc.removeLineClass(line, "text", it)
    })
    cssClassNames.wrap?.forEach((it) => {
      doc.removeLineClass(line, "wrap", it)
    })
    cssClassNames.gutter?.forEach((it) => {
      doc.removeLineClass(line, "gutter", it)
    })
  }

  /**
   * Returns true if the given {@link range} represents a selection within the {@link doc}.
   *
   * The selection may be `from -> to` or `to -> from` (i.e. the cursor may be at either end).
   */
  export function isSelected(doc: ReadonlyDoc, range: Range): boolean {
    return doc.listSelections().some(({ head, anchor }) => {
      const fromHeadToAnchor = Range.of({ from: head, to: anchor })
      const fromAnchorToHead = Range.of({ from: anchor, to: head })

      return fromHeadToAnchor.equals(range) || fromAnchorToHead.equals(range)
    })
  }

  /**
   * Clamps the {@link doc} cursor to be within the given {@link range}.
   * The operation executes using the given {@link origin}.
   */
  export function clampCursorToRange(doc: Doc, range: Range, origin: string): void {
    const cursor = doc.getCursor()
    if (Positions.areStrictlyOrdered({ before: cursor, after: range.from })) {
      doc.setCursor(range.from, undefined, { origin })
    } else if (Positions.areStrictlyOrdered({ before: range.to, after: cursor })) {
      doc.setCursor(range.to, undefined, { origin })
    }
  }
}
