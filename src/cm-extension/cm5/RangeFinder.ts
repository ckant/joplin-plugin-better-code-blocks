import { ReadonlyDoc } from "codemirror"

import { Range } from "@ext/codemirror/cm5/Range"
import { nil } from "@ext/stdlib/existence"

import { CodeDocs } from "@cm-extension/cm5/model/CodeDocs"
import { Parser } from "@cm-extension/cm5/Parser"

export interface RangeFinderProps {
  readonly parser: Parser
}

/**
 * Finds ranges within {@link Doc}s using the given {@link parser}.
 */
export class RangeFinder {
  private readonly parser: Parser

  static create(props: RangeFinderProps): RangeFinder {
    return new RangeFinder(props)
  }

  private constructor(props: RangeFinderProps) {
    this.parser = props.parser
  }

  /**
   * Returns the range that encloses the "active" code in {@link doc} (if one exists).
   *
   * Code is "active" if the cursor is inside its code fence.
   *
   * @see CodeDocs#getActiveCodeBlock
   * @see CodeDocs#getCodeRange
   */
  findActiveCodeRange(doc: ReadonlyDoc): Range | undefined {
    const codeBlocks = this.parser.parse(doc)

    const activeCodeBlock = CodeDocs.getActiveCodeBlock(doc, codeBlocks)
    if (nil(activeCodeBlock)) return undefined

    return CodeDocs.getCodeRange(doc, activeCodeBlock)
  }
}
