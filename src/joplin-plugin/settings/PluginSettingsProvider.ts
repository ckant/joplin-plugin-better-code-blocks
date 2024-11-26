import JoplinSettings from "api/JoplinSettings"

import { PluginSettings } from "@joplin-plugin/settings/PluginSettings"
import { RawPluginSettings } from "@joplin-plugin/settings/PluginSettingSection"

export interface PluginSettingsProviderProps {
  readonly joplinSettings: JoplinSettings
}

/**
 * Provides plugin settings from {@link joplinSettings}.
 */
export class PluginSettingsProvider {
  private readonly joplinSettings: JoplinSettings

  static create(props: PluginSettingsProviderProps): PluginSettingsProvider {
    return new PluginSettingsProvider(props)
  }

  private constructor(props: PluginSettingsProviderProps) {
    this.joplinSettings = props.joplinSettings
  }

  /**
   * Returns {@link PluginSettings} from {@link RawPluginSettings}.
   *
   * Converts {@link PluginSettings#excludedLanguages} from a `string` to a `string[]`
   * by trimming and splitting the raw comma-delimited string.
   */
  async provide(): Promise<PluginSettings> {
    const rawSettings = await this.provideRawSettings()
    return {
      completedLanguages: asStringArray(rawSettings.completedLanguages),
      completion: rawSettings.completion,
      copyFormat: rawSettings.copyFormat,
      cornerStyle: rawSettings.cornerStyle,
      excludedLanguages: asStringArray(rawSettings.excludedLanguages),
      rendering: rawSettings.rendering,
      renderLayout: rawSettings.renderLayout,
      selectAllCapturing: rawSettings.selectAllCapturing,
    }
  }

  private async provideRawSettings(): Promise<RawPluginSettings> {
    return {
      completedLanguages: await this.getRawSetting("completedLanguages"),
      completion: await this.getRawSetting("completion"),
      copyFormat: await this.getRawSetting("copyFormat"),
      cornerStyle: await this.getRawSetting("cornerStyle"),
      excludedLanguages: await this.getRawSetting("excludedLanguages"),
      rendering: await this.getRawSetting("rendering"),
      renderLayout: await this.getRawSetting("renderLayout"),
      selectAllCapturing: await this.getRawSetting("selectAllCapturing"),
    }
  }

  private async getRawSetting<T>(name: keyof RawPluginSettings): Promise<T> {
    return (await this.joplinSettings.value(name)) as T
  }
}

function asStringArray(value: string): readonly string[] {
  return trimAll(split(value))
}

function split(value: string): readonly string[] {
  return value.split(",")
}

function trimAll(value: readonly string[]): readonly string[] {
  return value.map((it) => it.trim())
}
