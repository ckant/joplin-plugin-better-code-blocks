import { RangeSetBuilder } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"

import { nil } from "@ext/stdlib/existence"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"
import { LineDecorations } from "@cm-extension/cm6/rendering/decoration/LineDecorations"
import { ReplaceDecorations } from "@cm-extension/cm6/rendering/decoration/ReplaceDecorations"

/**
 * {@link DecorationSet}s for {@link CodeBlock}s.
 */
export namespace DecorationSets {
  /**
   * Creates a {@link DecorationSet} for the {@link CodeBlock}s in the {@link view}.
   *
   * Each {@link CodeBlock} contributes the following decorations:
   * - A `line` decoration for the opening fence line for applying css styles
   * - A `replace` decoration for the opening fence text for replacing the content with a `widget`
   * - A `line` decoration for each code line for applying css styles
   * - A `replace` decoration for the closing fence text for replacing the content with a `widget`
   * - A `line` decoration for the closing fence line for applying css styles
   *
   * Skips decorations for {@link CodeBlock}s that are outside the {@link EditorView.visibleRanges}
   * and for those with languages that are explicitly excluded from rendering.
   */
  export function create(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>()
    for (const codeBlock of getDecoratableCodeBlocks(view)) {
      const { openingFenceStart, openingFenceEnd } = codeBlock
      builder.add(openingFenceStart, openingFenceStart, LineDecorations.openingFence)
      builder.add(openingFenceStart, openingFenceEnd, ReplaceDecorations.openingFence(codeBlock))

      const { firstCodeLine, lastCodeLine, codeLines } = codeBlock
      for (const codeLine of codeLines) {
        const { from } = view.state.doc.line(codeLine)
        const isFirst = codeLine === firstCodeLine
        const isLast = codeLine === lastCodeLine
        builder.add(from, from, LineDecorations.code({ isFirst, isLast }))
      }

      const { closingFenceStart, closingFenceEnd } = codeBlock
      builder.add(closingFenceStart, closingFenceStart, LineDecorations.closingFence)
      builder.add(closingFenceStart, closingFenceEnd, ReplaceDecorations.closingFence(codeBlock))
    }
    return builder.finish()
  }

  function getDecoratableCodeBlocks({ state, visibleRanges }: EditorView): readonly CodeBlock[] {
    const { excludedLanguages } = CodeEditorStates.getConfig(state)

    return CodeEditorStates.getCodeBlocks(state)
      .filter((it) => !isExcluded(it, excludedLanguages))
      .filter((it) => isVisible(it, visibleRanges))
  }

  function isVisible(codeBlock: CodeBlock, visibleRanges: EditorView["visibleRanges"]): boolean {
    return visibleRanges.some((range) => codeBlock.touchesRange(range, { includeFences: true }))
  }

  function isExcluded(codeBlock: CodeBlock, excludedLanguages: readonly string[]): boolean {
    if (nil(codeBlock.lang)) return false

    return excludedLanguages.includes(codeBlock.lang)
  }
}
