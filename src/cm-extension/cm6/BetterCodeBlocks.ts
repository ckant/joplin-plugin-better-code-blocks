import { CompletionSource as CmCompletionSource } from "@codemirror/autocomplete"
import { Extension } from "@codemirror/state"
import { ConditionalPick } from "type-fest"

import { CompletionSource } from "@cm-extension/cm6/completion/CompletionSource"
import { Extensions } from "@cm-extension/cm6/Extensions"
import { Config } from "@cm-extension/cm6/model/Config"

/**
 * BetterCodeBlocks Code Mirror 6 extension.
 *
 * @see https://codemirror.net/docs/ref/
 */
export namespace BetterCodeBlocks {
  type StringConfigs = ConditionalPick<Config, string>

  // eslint-disable-next-line unicorn/no-null -- CompletionSource uses null
  const NoCompletionSource: CmCompletionSource = () => null
  const NoExtension: Extension = []

  /**
   * Returns BetterCodeBlocks extension configured by the given {@link config}.
   */
  export function extension(config: Config): Extension {
    return [
      // State Fields
      Extensions.codeBlocksStateField,

      // Transaction Filters
      Extensions.fenceLineBreakDeleteFilter,
      Extensions.lastCodeLineSelectionFilter,
      Extensions.openingFenceCursorFilter,
      Extensions.closingFenceCursorFilter,
      when(config, "selectAllCapturing", {
        enabled: Extensions.allCodeSelectionFilter,
        disabled: NoExtension,
      }),

      // Atomic Ranges
      Extensions.codeFenceAtomicRanges,

      // Update Listeners
      Extensions.emptyCodeBlockUpdater,

      // Themes
      Extensions.theme,

      // View Plugins
      when(config, "rendering", {
        enabled: Extensions.viewPlugin,
        disabled: NoExtension,
      }),

      // Editor Attributes
      Extensions.configEditorAttributes,

      // Facets
      Extensions.configFacetOf(config),
    ]
  }

  /**
   * Returns a {@link CmCompletionSource} configured by the given {@link config}.
   */
  export function completionSource(config: Config): CmCompletionSource {
    return when(config, "completion", {
      enabled: CompletionSource(config),
      disabled: NoCompletionSource,
    })
  }

  function when<ConfigKey extends keyof StringConfigs, ReturnValue>(
    config: Config,
    key: ConfigKey,
    values: Record<StringConfigs[ConfigKey], ReturnValue>,
  ): ReturnValue {
    return values[config[key]]
  }
}
