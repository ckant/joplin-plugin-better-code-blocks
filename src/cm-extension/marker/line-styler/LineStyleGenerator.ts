import { Arrays } from "@ext/stdlib/Arrays"
import { Repeat } from "@ext/stdlib/Repeat"

import { LineStyle } from "@cm-extension/marker/line-styler/LineStyle"
import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { CodeBlockClass as Cb } from "@cm-extension/style/CodeBlockClass"

/**
 * Generates {@link LineStyle}s for adding line classes.
 */
export class LineStyleGenerator {
  static create(): LineStyleGenerator {
    return new LineStyleGenerator()
  }

  private constructor() {
    // empty
  }

  /**
   * Generates {@link LineStyle}s for lines in the given {@link codeBlocks}.
   */
  generate(codeBlocks: readonly CodeBlock[]): readonly LineStyle[] {
    return codeBlocks.flatMap((codeBlock) => [
      {
        line: codeBlock.startLine,

        background: [Cb.startBackground],
        text: [Cb.startText],
        wrap: [Cb.startLine],
      },

      ...this.generateStyledCodeLines(codeBlock),

      {
        line: codeBlock.endLine,

        background: [Cb.endBackground],
        text: [Cb.endText],
        wrap: [Cb.endLine],
      },
    ])
  }

  private generateStyledCodeLines(codeBlock: CodeBlock): readonly LineStyle[] {
    return Repeat.times(codeBlock.size, (i) => {
      const line = codeBlock.startLine + 1 + i
      const isFirstLine = i === 0
      const isLastLine = i === codeBlock.size - 1

      return this.generateStyledCodeLine({
        line,
        isFirstLine,
        isLastLine,
      })
    })
  }

  private generateStyledCodeLine({
    line,
    isFirstLine,
    isLastLine,
  }: {
    line: number
    isFirstLine: boolean
    isLastLine: boolean
  }): LineStyle {
    const maybeFirst = isFirstLine ? Cb.first : undefined
    const maybeLast = isLastLine ? Cb.last : undefined

    return {
      line,
      background: Arrays.compact([Cb.codeBackground, maybeFirst, maybeLast]),
      text: Arrays.compact([Cb.codeText, maybeFirst, maybeLast]),
      wrap: Arrays.compact([Cb.codeLine, maybeFirst, maybeLast]),
    }
  }
}
