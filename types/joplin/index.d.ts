import "api/types"
import "api/JoplinSettings"

import {
  ContentScriptContext,
  ReducedSettingItem,
  SettingItem,
  SettingItemType,
  SettingSection,
} from "api/types"
import CodeMirror from "codemirror"

declare module "api/types" {
  /**
   * Exported definition of a CodeMirror plugin.
   *
   * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#codemirrorplugin
   */
  export type CmContentScriptDefinition = (context: ContentScriptContext) => CmContentScript

  /**
   * Content script for a CodeMirror plugin.
   *
   * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#codemirrorplugin
   */
  export interface CmContentScript {
    /**
     * A plugin needs to either include a plugin here OR have enable an addon
     */
    plugin: (codeMirror: typeof CodeMirror) => void

    /**
     * Some resources are included with codemirror and extend the functionality in standard ways
     * via plugins (called addons) which you can find here: https://codemirror.net/doc/manual.html#addons
     * and are available under the addon/ directory
     * or by adding keymaps under the keymap/ directory
     * or additional modes available under the mode/ directory
     * All are available in the  CodeMirror source: https://github.com/codemirror/codemirror
     */
    codeMirrorResources: string[]

    /**
     * Often addons for codemirror need to be enabled using an option,
     * There is also certain codemirror functionality that can be enabled/disabled using
     * simple options
     */
    codeMirrorOptions: Record<string, unknown>

    /**
     * More complex plugins (and some addons) will require additional css styling
     * which is available through the assets function. As seen below, this styling can
     * either point to a css file in the plugin src directory or be included inline.
     */
    assets?: CmContentScriptAssets
  }

  /**
   * Type of assets in a {@link CmContentScript}.
   *
   * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#codemirrorplugin
   */
  export type CmContentScriptAssets = (
    theme: unknown,
  ) => ({ name: string } | { inline: boolean; text: string; mime: string })[]

  /**
   * A refinement of {@link SettingItem} that excludes {@link SettingItem#section} as well as
   * the {@link SettingItemType}s that are not useful for plugins.
   *
   * The `section` is made redundant by combining the {@link SettingSection} with its
   * relevant {@link SettingItem}s in {@link ExtendedSettingSection}.
   */
  export type ReducedSettingItem = Omit<SettingItem, "section" | "type"> & {
    readonly type: Exclude<SettingItemType, SettingItemType.Object | SettingItemType.Array>
  }

  /**
   * A refinement of {@link SettingSection} that combines it with its relevant
   * {@link ReducedSettingItems}s to form a single settings schema.
   */
  export type ExtendedSettingSection<SettingsType> = SettingSection & {
    settings: ReducedSettingItems<SettingsType>
  }

  /**
   * Defines the plugin setting registration in terms of the usage of the values that are read from
   * the settings at runtime.
   *
   * This adds some type safety to the plugin setting section registration code and introduces
   * compile-time failures when the registration schema differs from the intended runtime schema.
   *
   * This makes the following simplifying assumptions:
   *
   * - A `number` is defined as an `Int` setting
   * - A type union of `number`s is defined as an `Int` enum setting
   * - A `string` is defined as a `String` setting
   * - A type union of `string`s is defined as a `String` enum setting
   * - A `boolean` is defined as a `Bool` setting
   * - An array is defined as a `String` setting (since `Array` settings don't actually exist)
   *
   * e.g. given the following runtime PluginSettings schema
   * ```typescript
   * {
   *   fooOrBar: "foo" | "bar",
   *   arr: string[],
   * }
   * ```
   *
   * The `ReducedSettingItems` of the schema is:
   * ```typescript
   * {
   *   "fooOrBar": {
   *     type: SettingsItemType.String,
   *     isEnum: true,
   *     options: {
   *       foo: // ...
   *       bar: // ...
   *     },
   *     // ...
   *   },
   *   "int": {
   *     type: SettingsItemType.String,
   *     // ...
   *   },
   * }
   * ```
   *
   * - a {@link SettingItemType.String} enum called `fooOrBar` with options `foo` and `bar`
   * - a {@link SettingItemType.String} called `arr` (an array represented as a string)
   */
  export type ReducedSettingItems<SettingsType> = {
    [SettingName in keyof SettingsType]: SettingsType[SettingName] extends number
      ? number extends SettingsType[SettingName]
        ? ReducedSettingItem & {
            type: SettingItemType.Int
            value: number
            isEnum?: false | undefined
            options?: undefined
          }
        : ReducedSettingItem & {
            type: SettingItemType.Int
            value: SettingsType[SettingName]
            isEnum: true
            options: {
              [k in SettingsType[SettingName]]: string
            }
          }
      : SettingsType[SettingName] extends string
      ? string extends SettingsType[SettingName]
        ? ReducedSettingItem & {
            type: SettingItemType.String
            value: string
            isEnum?: false | undefined
            options?: undefined
          }
        : ReducedSettingItem & {
            type: SettingItemType.String
            value: SettingsType[SettingName]
            isEnum: true
            options: {
              [k in SettingsType[SettingName]]: string
            }
          }
      : SettingsType[SettingName] extends boolean
      ? ReducedSettingItem & {
          type: SettingItemType.Bool
          value: boolean
          isEnum?: false | undefined
          options?: undefined
        }
      : [] extends SettingsType[SettingName]
      ? ReducedSettingItem & {
          type: SettingItemType.String
          value: string
          isEnum?: false | undefined
          options?: undefined
        }
      : never
  }
}

declare module "api/JoplinSettings" {
  /**
   * Defines the values read from the plugin settings at runtime in terms of the plugin
   * setting registration.
   *
   * This adds some type safety to the plugin setting reading code and introduces
   * compile-time failures when the registration schema differs from setting reading schema.
   *
   * e.g. given the following plugin settings registration:
   * ```typescript
   * {
   *   "fooOrBar": {
   *     type: SettingsItemType.String,
   *     isEnum: true,
   *     options: {
   *       foo: // ...
   *       bar: // ...
   *     },
   *     // ...
   *   },
   *   "int": {
   *     type: SettingsItemType.Int,
   *     // ...
   *   },
   * }
   *
   * ```
   *
   * The `RawSettings` of that registration is:
   * ```typescript
   * {
   *   fooOrBar: "foo" | "bar",
   *   int: number,
   * }
   * ```
   */
  export type RawSettings<SettingsType extends Record<string, ReducedSettingItem>> = {
    [Setting in keyof SettingsType]: SettingsType[Setting]["isEnum"] extends true
      ? keyof SettingsType[Setting]["options"]
      : SettingsType[Setting]["type"] extends SettingItemType.Int
      ? number
      : SettingsType[Setting]["type"] extends SettingItemType.String
      ? string
      : SettingsType[Setting]["type"] extends SettingItemType.Bool
      ? boolean
      : never
  }
}
