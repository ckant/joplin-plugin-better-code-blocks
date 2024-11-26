import { Doc } from "codemirror"

import { Docs } from "@ext/codemirror/cm5/Docs"
import { def } from "@ext/stdlib/existence"

import { Formatter } from "@cm-extension/cm5/formatter/Formatter"
import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { Origin } from "@cm-extension/cm5/model/Origin"

/**
 * Inserts new lines between adjacent {@link CodeBlock}s.
 *
 * This is necessary for cursor placement between rendered {@link CodeBlock}s, as the user can't
 * place the cursor on the start (or end) line to insert content between "unspaced" code fences.
 *
 * e.g. the following adjacent code fences:
 * <pre>
 * ~~~one
 * ~~~
 * ~~~two
 * ~~~
 * </pre>
 *
 * are "spaced", allowing for the user to place the cursor between them:
 *
 * <pre>
 * ~~~one
 * ~~~
 *
 * ~~~two
 * ~~~
 * </pre>
 */
export class BetweenSpacer implements Formatter {
  static create(): BetweenSpacer {
    return new BetweenSpacer()
  }

  private constructor() {
    // empty
  }

  /**
   * Spaces the adjacent {@link codeBlocks} within the {@link doc}.
   * The operation executes using the given {@link origin}.
   */
  format(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
    return this.space(doc, codeBlocks, origin)
  }

  private space(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
    let lastEndLine: number | undefined
    let newLines = 0
    return codeBlocks.map((codeBlock) => {
      if (def(lastEndLine) && codeBlock.startsAt(lastEndLine + 1)) {
        Docs.insertNewLine(doc, { line: lastEndLine + 1 + newLines, ch: 0 }, origin)
        newLines++
      }

      lastEndLine = codeBlock.endLine
      return codeBlock.shiftDownBy(newLines)
    })
  }
}
