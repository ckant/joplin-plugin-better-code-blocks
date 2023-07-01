import { RawSettings } from "api/JoplinSettings"
import { ExtendedSettingSection, SettingItemType } from "api/types"

import { PluginSettings } from "@joplin-plugin/settings/PluginSettings"

/**
 * Represents the {@link ExtendedSettingSection} of the Joplin plugin.
 * The settings correspond directly to those defined in {@link PluginSettings}.
 */
export const PluginSettingSection = {
  label: "Better Code Blocks",
  // Font Awesome code icon
  // https://fontawesome.com/v5/icons/code?f=classic&s=solid
  iconName: "fa fa-solid fa-code",
  settings: {
    completion: {
      type: SettingItemType.String,
      public: true,
      value: "enabled",
      isEnum: true,
      options: {
        enabled: "Enabled",
        disabled: "Disabled",
      },
      label: "Autocompletion",
      description: "Enables/disables automatic completion of code blocks when [Enter] is pressed",
    },
    rendering: {
      type: SettingItemType.String,
      public: true,
      value: "enabled",
      isEnum: true,
      options: {
        enabled: "Enabled",
        disabled: "Disabled",
      },
      label: "Rendering",
      description: "Enables/disables rendering of code blocks",
    },
    selectAllCapturing: {
      type: SettingItemType.String,
      public: true,
      value: "enabled",
      isEnum: true,
      options: {
        enabled: "Select current code block",
        disabled: "Select everything",
      },
      label: "Behavior of [Select All] inside code blocks",
      description: "Changes the behavior of [Select All] while the cursor is inside code blocks",
    },
    renderLayout: {
      type: SettingItemType.String,
      public: true,
      value: "minimal",
      isEnum: true,
      options: {
        minimal: "Minimal",
        standard: "Standard",
      },
      label: "Render layout",
      description: "Changes the layout of rendered code blocks",
    },
    cornerStyle: {
      type: SettingItemType.String,
      public: true,
      value: "square",
      isEnum: true,
      options: {
        square: "Square",
        round: "Round",
      },
      label: "Corner style",
      description: "Changes the border style of rendered code blocks",
    },
    excludedLanguages: {
      type: SettingItemType.String,
      public: true,
      value: "",
      label: "Excluded languages (comma-separated list)",
      description: "Disables rendering of code blocks for specific languages",
    },
    copyFormat: {
      type: SettingItemType.String,
      public: true,
      value: "code",
      isEnum: true,
      options: {
        code: "Copy code",
        fencedCode: "Copy code and fences",
      },
      label: "Copy button behavior",
      description: "Controls what's copied when the [Copy Code] button is clicked",
    },
  },
} as const satisfies ExtendedSettingSection<PluginSettings>

/**
 * Represents the type of the {@link PluginSettingSection} settings.
 */
export type RawPluginSettings = RawSettings<(typeof PluginSettingSection)["settings"]>
