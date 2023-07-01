import { Doc } from "codemirror"

import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { CodeBlocks } from "@cm-extension/model/CodeBlocks"
import { Origin } from "@cm-extension/model/Origin"
import { RenderParser } from "@cm-extension/renderer/RenderParser"
import { RenderPerformer } from "@cm-extension/renderer/RenderPerformer"

export interface RendererProps {
  readonly renderParser: RenderParser
  readonly renderPerformer: RenderPerformer
}

/**
 * Renders code fences found by the {@link renderParser} using the given {@link renderPerformer}.
 */
export class Renderer {
  private readonly renderParser: RenderParser
  private readonly renderPerformer: RenderPerformer

  private codeBlocks: readonly CodeBlock[] = []

  static create(props: RendererProps): Renderer {
    return new Renderer(props)
  }

  private constructor(props: RendererProps) {
    this.renderParser = props.renderParser
    this.renderPerformer = props.renderPerformer
  }

  /**
   * Renders all code fences in the {@link doc}.
   * The operation executes using the given {@link origin}.
   *
   * As an optimization, code fences are only re-rendered if any have changed position.
   *
   * e.g. given the following code fence:
   *
   * <pre>
   * ~~~typescript
   * // some code
   * ~~~
   * </pre>
   *
   * re-rendering is unnecessary when something gets typed below:
   *
   * <pre>
   * ~~~typescript
   * // some code
   * ~~~
   * # Something added below
   * </pre>
   *
   */
  render(doc: Doc, origin: Origin): void {
    const codeBlocks = this.renderParser.parse(doc)
    if (CodeBlocks.areEqual(this.codeBlocks, codeBlocks)) return

    this.codeBlocks = this.renderPerformer.perform(doc, codeBlocks, origin)
  }
}
