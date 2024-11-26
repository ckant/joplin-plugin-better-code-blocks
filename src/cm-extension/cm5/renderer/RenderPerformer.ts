import { Doc } from "codemirror"

import { Formatter } from "@cm-extension/cm5/formatter/Formatter"
import { Marker } from "@cm-extension/cm5/marker/Marker"
import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { CodeDocs } from "@cm-extension/cm5/model/CodeDocs"
import { Origin } from "@cm-extension/cm5/model/Origin"

export interface RenderPerformerProps {
  readonly formatter: Formatter
  readonly marker: Marker
}

/**
 * Renders code fences, formatted by the {@link formatter} and marked by the {@link marker}.
 */
export class RenderPerformer {
  private readonly formatter: Formatter
  private readonly marker: Marker

  static create(props: RenderPerformerProps): RenderPerformer {
    return new RenderPerformer(props)
  }

  private constructor(props: RenderPerformerProps) {
    this.formatter = props.formatter
    this.marker = props.marker
  }

  /**
   * Renders {@link codeBlocks} within {@link doc} and returns the resulting {@link CodeBlock}s.
   * The operation executes using the given {@link origin}.
   *
   * The {@link codeBlocks} are (possibly) modified during the rendering (e.g. by adding new lines).
   * If the cursor lies within a code fence after formatting (a code fence is "active"),
   * the cursor moves inside that code fence's code for easier editing.
   */
  perform(doc: Doc, codeBlocks: readonly CodeBlock[], origin: Origin): readonly CodeBlock[] {
    return this.renderCodeBlocks(doc, codeBlocks, origin)
  }

  private renderCodeBlocks(
    doc: Doc,
    codeBlocks: readonly CodeBlock[],
    origin: Origin,
  ): readonly CodeBlock[] {
    const formattedCodeBlocks = this.formatter.format(doc, codeBlocks, origin)
    CodeDocs.clampCursorOfActiveCodeBlockToCode(doc, formattedCodeBlocks, origin)
    this.marker.mark(doc, formattedCodeBlocks)
    return formattedCodeBlocks
  }
}
