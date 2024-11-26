import { Decoration, ReplaceDecorationSpec } from "@codemirror/view"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { Widgets } from "@cm-extension/cm6/rendering/decoration/Widgets"

/**
 * {@link Decoration.replace}s for {@link CodeBlock}s.
 */
export namespace ReplaceDecorations {
  /**
   * {@link ReplaceDecorationSpec} that replaces an opening fence with
   * a {@link Widgets.OpeningFence}.
   */
  export function openingFenceSpec(codeBlock: CodeBlock): ReplaceDecorationSpec {
    return { widget: Widgets.OpeningFence.create({ codeBlock }) }
  }
  /**
   * {@link Decoration.replace} that replaces an opening fence with
   * a {@link Widgets.OpeningFence}.
   */
  export function openingFence(codeBlock: CodeBlock): Decoration {
    return Decoration.replace(openingFenceSpec(codeBlock))
  }

  /**
   * {@link ReplaceDecorationSpec} that replaces a closing fence with
   * a {@link Widgets.ClosingFence}.
   */
  export function closingFenceSpec(codeBlock: CodeBlock): ReplaceDecorationSpec {
    return { widget: Widgets.ClosingFence.create({ codeBlock }) }
  }
  /**
   * {@link Decoration.replace} that replaces an closing fence with
   * a {@link Widgets.ClosingFence}.
   */
  export function closingFence(codeBlock: CodeBlock): Decoration {
    return Decoration.replace(closingFenceSpec(codeBlock))
  }
}
