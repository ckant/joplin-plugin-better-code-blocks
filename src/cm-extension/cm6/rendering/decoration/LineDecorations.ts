import { Decoration, LineDecorationSpec } from "@codemirror/view"

import { Arrays } from "@ext/stdlib/Arrays"

import { CodeBlockClass as Cb } from "@cm-extension/cm6/theme/style/CodeBlockClass"

/**
 * {@link Decoration.line}s for {@link CodeBlock}s.
 */
export namespace LineDecorations {
  /**
   * {@link LineDecorationSpec} that assigns a css class to an opening fence line.
   */
  export const openingFenceSpec: LineDecorationSpec = { attributes: { class: Cb.startLine } }
  /**
   * {@link Decoration.line} that assigns a css class to an opening fence line.
   */
  export const openingFence = Decoration.line(openingFenceSpec)

  /**
   * {@link LineDecorationSpec} that assigns a css class to a closing fence line.
   */
  export const closingFenceSpec: LineDecorationSpec = { attributes: { class: Cb.endLine } } as const
  /**
   * {@link Decoration.line} that assigns a css class to a closing fence line.
   */
  export const closingFence = Decoration.line(closingFenceSpec)

  /**
   * {@link LineDecorationSpec} that assigns css classes to a code line.
   * Assigns one additional class to a line that {@link isFirst} and/or a line that {@link isLast}.
   */
  export function codeSpec({
    isFirst,
    isLast,
  }: {
    isFirst: boolean
    isLast: boolean
  }): LineDecorationSpec {
    const classes = Arrays.compact([
      Cb.codeLine,
      isFirst ? Cb.first : undefined,
      isLast ? Cb.last : undefined,
    ])
    return { attributes: { class: classes.join(" ") } }
  }

  /**
   * {@link Decoration.line} that assigns css classes to a code line.
   * Assigns one additional class to a line that {@link isFirst} and/or a line that {@link isLast}.
   */
  export function code(attributes: { isFirst: boolean; isLast: boolean }): Decoration {
    return Decoration.line(codeSpec(attributes))
  }
}
