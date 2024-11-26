import { DecoratedPluginValue, DecorationSet, PluginSpec } from "@codemirror/view"

/**
 * `ViewPlugin` specification that provides decorations stored on the {@link DecoratedPluginValue}.
 *
 * @see PluginSpec
 */
export const ViewPluginSpec: PluginSpec<DecoratedPluginValue> = {
  /**
   * Provides decorations stored on the {@link plugin}.
   */
  decorations(plugin: DecoratedPluginValue): DecorationSet {
    return plugin.decorations
  },
}
