import { Doc, ReadonlyDoc } from "codemirror"

import { Docs } from "@ext/codemirror/Docs"
import { Range } from "@ext/codemirror/Range"
import { nil } from "@ext/stdlib/existence"

import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { Origin } from "@cm-extension/model/Origin"

/**
 * Operations on {@link CodeBlocks} within {@link Doc}s.
 */
export namespace CodeDocs {
  /**
   * Returns the `code` within the given {@link codeBlock} in the {@link doc}.
   * This may optionally {@link includeFences} of the {@link codeBlock}.
   */
  export function getCode(
    doc: ReadonlyDoc,
    codeBlock: CodeBlock,
    options?: { includeFences: boolean },
  ): string {
    if (options?.includeFences ?? false) {
      return doc.getRange(codeBlock.start.fromPosition, codeBlock.end.toPosition)
    } else {
      const { from, to } = getCodeRange(doc, codeBlock)
      return doc.getRange(from, to)
    }
  }

  /**
   * Returns the range that encloses the code within the given {@link codeBlock} in the {@link doc}.
   */
  export function getCodeRange(doc: ReadonlyDoc, codeBlock: CodeBlock): Range {
    const from = { line: codeBlock.startLine + 1, ch: 0 }
    const codeEnd = doc.getLine(codeBlock.endLine - 1).length
    const to = { line: codeBlock.endLine - 1, ch: codeEnd }

    return Range.of({ from, to })
  }

  /**
   * Returns which of the {@link codeblocks} has the {@link doc} cursor inside it (if one exists).
   */
  export function getActiveCodeBlock(
    doc: ReadonlyDoc,
    codeBlocks: readonly CodeBlock[],
  ): CodeBlock | undefined {
    const { line } = doc.getCursor()
    return codeBlocks.find((it) => it.containsLine(line, { includeBoundary: true }))
  }

  /**
   * Moves the {@link doc} cursor inside the `code` within the active {@link CodeBlock}.
   * The operation executes using the given {@link origin}.
   */
  export function clampCursorOfActiveCodeBlockToCode(
    doc: Doc,
    codeBlocks: readonly CodeBlock[],
    origin: Origin,
  ): void {
    const activeCodeBlock = getActiveCodeBlock(doc, codeBlocks)
    if (nil(activeCodeBlock)) return

    const codeRange = getCodeRange(doc, activeCodeBlock)
    Docs.clampCursorToRange(doc, codeRange, origin)
  }
}
