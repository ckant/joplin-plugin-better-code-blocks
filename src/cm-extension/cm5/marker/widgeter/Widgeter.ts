import { Doc } from "codemirror"

import { Marker } from "@cm-extension/cm5/marker/Marker"
import { Widget } from "@cm-extension/cm5/marker/widgeter/Widget"
import { WidgetGenerator } from "@cm-extension/cm5/marker/widgeter/WidgetGenerator"
import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"

/**
 * A {@link Widget} that's later removable.
 */
interface ClearableWidget extends Widget {
  clear(): void
}

export interface WidgeterProps {
  readonly widgetGenerator: WidgetGenerator
}

/**
 * Replaces text with widgets generated by {@link widgetGenerator}.
 */
export class Widgeter implements Marker {
  private readonly widgetGenerator: WidgetGenerator
  private widgets: readonly ClearableWidget[] = []

  static create(props: WidgeterProps): Widgeter {
    return new Widgeter(props)
  }

  private constructor(props: WidgeterProps) {
    this.widgetGenerator = props.widgetGenerator
  }

  /**
   * Marks text with replacement widgets for the given {@link codeBlocks} in the {@link doc}.
   *
   * Removes all previous widgets before adding new ones.
   */
  mark(doc: Doc, codeBlocks: readonly CodeBlock[]): void {
    this.updateWidgets(doc, codeBlocks)
  }

  private updateWidgets(doc: Doc, codeBlocks: readonly CodeBlock[]): void {
    const generatedWidgets = this.widgetGenerator.generate(doc, codeBlocks)

    this.widgets.forEach((it) => it.clear())

    this.widgets = generatedWidgets.map((widget) => {
      const { range, element } = widget

      const marker = doc.markText(
        { line: range.line, ch: range.from },
        { line: range.line, ch: range.to },
        {
          atomic: true,
          collapsed: true,
          inclusiveLeft: false,
          inclusiveRight: false,
          replacedWith: element,
          selectLeft: false,
          selectRight: false,
        },
      )
      return { ...widget, clear: () => marker.clear() }
    })
  }
}
