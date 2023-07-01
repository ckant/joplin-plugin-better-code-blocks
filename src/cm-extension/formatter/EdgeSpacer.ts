import { Doc } from "codemirror"
import { Arrays } from "@ts-belt"

import { Docs } from "@ext/codemirror/Docs"
import { nil } from "@ext/stdlib/existence"

import { Formatter } from "@cm-extension/formatter/Formatter"
import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { Origin } from "@cm-extension/model/Origin"

/**
 * Inserts a new line before/after a {@link CodeBlock} that starts/ends at the start/end of a {@link Doc}.
 *
 * This is necessary for cursor placement at the start/end of the {@link Doc}, as the user can't
 * place the cursor on the start (or end) line to insert content around the code fence.
 *
 * e.g. the following code fence that spans the entire doc:
 * <pre>
 * ~~~typescript
 * // some
 * // code
 * // here
 * ~~~
 * </pre>
 *
 * has a new line inserted before and after it, allowing the user to place the cursor before/after:
 * <pre>
 * (new line before)
 * ~~~typescript
 * // some
 * // code
 * // here
 * ~~~
 * (new line after)
 * </pre>
 */
export class EdgeSpacer implements Formatter {
  static create(): EdgeSpacer {
    return new EdgeSpacer()
  }

  private constructor() {
    // empty
  }

  /**
   * Spaces the first/last {@link CodeBlock} if it begins/ends the {@link doc}.
   * The operation executes using the given {@link origin}.
   */
  format(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
    return this.space(doc, codeBlocks, origin)
  }

  private space(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
    const startSpacedCodeBlocks = this.spaceStart(doc, codeBlocks, origin)
    return this.spaceEnd(doc, startSpacedCodeBlocks, origin)
  }

  private spaceStart(
    doc: Doc,
    codeBlocks: readonly CodeBlock[],
    origin: Origin,
  ): readonly CodeBlock[] {
    const firstCodeBlock = Arrays.head(codeBlocks)
    if (nil(firstCodeBlock)) return codeBlocks

    const firstLine = doc.firstLine()
    if (!firstCodeBlock.startsAt(firstLine)) return codeBlocks

    Docs.insertNewLine(doc, { line: 0, ch: 0 }, origin)
    return codeBlocks.map((it) => it.shiftDownBy(1))
  }

  private spaceEnd(
    doc: Doc,
    codeBlocks: readonly CodeBlock[],
    origin: Origin,
  ): readonly CodeBlock[] {
    // newline at end
    const lastCodeBlock = Arrays.last(codeBlocks)
    if (nil(lastCodeBlock)) return codeBlocks

    const lastLine = doc.lastLine()
    if (!lastCodeBlock.endsAt(lastLine)) return codeBlocks

    const cursor = doc.getCursor()
    Docs.insertNewLine(doc, { line: lastLine + 1, ch: 0 }, origin)
    doc.setCursor(cursor)
    return codeBlocks
  }
}
