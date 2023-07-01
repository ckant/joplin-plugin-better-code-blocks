import { Editor, EditorChange } from "codemirror"

import { Origin } from "@cm-extension/model/Origin"
import { Renderer } from "@cm-extension/renderer/Renderer"

export interface RenderHandlerProps {
  readonly renderer: Renderer
}

/**
 * Handles rendering of code fences using the given {@link renderer}.
 */
export class RenderHandler {
  private readonly renderer: Renderer

  static create(props: RenderHandlerProps): RenderHandler {
    return new RenderHandler(props)
  }

  private constructor(props: RenderHandlerProps) {
    this.renderer = props.renderer
  }

  /**
   * Renders code fences in the {@link cm} {@link Doc} after an editor change.
   *
   * The operation executes using {@link Origin#RenderHandler}.
   *
   * Ignores re-rendering that's caused by changed by {@link RenderHandler} itself.
   */
  renderOnChange(cm: Editor, { origin }: EditorChange): void {
    if (origin !== Origin.RenderHandler) this.renderInternal(cm)
  }

  /**
   * Renders code fences in the {@link cm} {@link Doc} immediately.
   *
   * The operation executes using {@link Origin#RenderHandler}.
   */
  renderNow(cm: Editor): void {
    this.renderInternal(cm)
  }

  private renderInternal(cm: Editor): void {
    cm.operation(() => this.renderer.render(cm.getDoc(), Origin.RenderHandler))
  }
}
