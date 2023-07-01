import { Doc } from "codemirror"

import { Docs } from "@ext/codemirror/Docs"

import { Formatter } from "@cm-extension/formatter/Formatter"
import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { Origin } from "@cm-extension/model/Origin"

/**
 * Inserts a new line into empty {@link CodeBlock}s.
 *
 * This is necessary for cursor placement inside rendered {@link CodeBlock}s,
 * as the user can't move the cursor to the start (or end) line to "open" the code fence manually.
 *
 * e.g. the following "closed" code fence:
 *
 * <pre>
 * ~~~typescript
 * ~~~
 * </pre>
 *
 * is "opened", allowing the user to move the cursor inside:
 *
 * <pre>
 * ~~~typescript
 *
 * ~~~
 * </pre>
 *
 */
export class Opener implements Formatter {
  static create(): Opener {
    return new Opener()
  }

  private constructor() {
    // empty
  }

  /**
   * Opens the closed {@link codeBlocks} within the {@link doc}.
   * The operation executes using the given {@link origin}.
   */
  format(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
    return this.open(doc, codeBlocks, origin)
  }

  private open(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
    let newLines = 0
    return codeBlocks.map((codeBlock) => {
      if (!codeBlock.isEmpty()) return codeBlock.shiftDownBy(newLines)

      Docs.insertNewLine(doc, { line: codeBlock.endLine + newLines, ch: 0 }, origin)
      newLines++

      return CodeBlock.of({
        start: codeBlock.start.plusLines(newLines - 1),
        end: codeBlock.end.plusLines(newLines),
        lang: codeBlock.lang,
        openingFence: codeBlock.openingFence,
        closingFence: codeBlock.closingFence,
      })
    })
  }
}
