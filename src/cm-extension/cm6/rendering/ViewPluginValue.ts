import { DecoratedPluginValue, DecorationSet, EditorView, ViewUpdate } from "@codemirror/view"

import { DecorationSets } from "@cm-extension/cm6/rendering/decoration/DecorationSets"

export interface ViewPluginValueProps {
  readonly view: EditorView
}

/**
 * `ViewPlugin` value that generates and stores {@link CodeBlock} decorations.
 */
export class ViewPluginValue implements DecoratedPluginValue {
  decorations: DecorationSet

  /**
   * Creates a {@link ViewPluginValue} and generates / stores {@link CodeBlock} decorations
   * from the given {@link ViewPluginValueProps.view}.
   */
  static create(props: ViewPluginValueProps): ViewPluginValue {
    return new ViewPluginValue(props)
  }

  private constructor({ view }: ViewPluginValueProps) {
    this.decorations = DecorationSets.create(view)
  }

  /**
   * Regenerates / updates stored {@link CodeBlock} decorations from the given {@link view}.
   *
   * Skips the update unless the {@link docChanged} or the {@link viewportChanged}.
   */
  update({ docChanged, viewportChanged, view }: ViewUpdate): void {
    if (!docChanged && !viewportChanged) return

    this.decorations = DecorationSets.create(view)
  }
}
