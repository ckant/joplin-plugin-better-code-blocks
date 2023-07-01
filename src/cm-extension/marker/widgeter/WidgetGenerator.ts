import { ReadonlyDoc } from "codemirror"

import { Html } from "@ext/dom/Html"

import { CopyButtonGenerator } from "@cm-extension/marker/widgeter/CopyButtonGenerator"
import { Widget } from "@cm-extension/marker/widgeter/Widget"
import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { BuiltInClass } from "@cm-extension/style/BuiltInClass"
import { CodeBlockClass as Cb } from "@cm-extension/style/CodeBlockClass"

const { span } = Html
const { monospace } = BuiltInClass

export interface WidgetGeneratorProps {
  readonly copyButtonGenerator: CopyButtonGenerator
}

/**
 * Generates {@link Widget}s to replace text ranges using the given {@link copyButtonGenerator}.
 */
export class WidgetGenerator {
  private readonly copyButtonGenerator: CopyButtonGenerator

  static create(props: WidgetGeneratorProps): WidgetGenerator {
    return new WidgetGenerator(props)
  }

  private constructor(props: WidgetGeneratorProps) {
    this.copyButtonGenerator = props.copyButtonGenerator
  }

  /**
   * Generates {@link Widget}s for the given {@link codeBlocks} in the {@link doc}.
   */
  generate(doc: ReadonlyDoc, codeBlocks: readonly CodeBlock[]): readonly Widget[] {
    return codeBlocks.flatMap((codeBlock) => {
      const { start, end, lang, openingFence, closingFence } = codeBlock

      const startWidget = {
        element: span({
          className: Cb.startWidget,
          children: [
            span({ className: `${Cb.openingFence} ${monospace}`, textContent: openingFence }),
            this.copyButtonGenerator.generate(doc, codeBlock),
          ],
        }),
        range: start,
      }

      const endWidget = {
        element: span({
          className: Cb.endWidget,
          children: [
            span({ className: `${Cb.closingFence} ${monospace}`, textContent: closingFence }),
            span({ className: `${Cb.lang} ${monospace}`, textContent: lang }),
          ],
        }),
        range: end,
      }

      return [startWidget, endWidget]
    })
  }
}
