import ActualJoplinSettings from "api/JoplinSettings"
import { ExtendedSettingSection } from "api/types"
import { Dicts } from "@ts-belt"

/**
 * Extensions for `JoplinSettings`.
 */
export namespace JoplinSettings {
  /**
   * Registers a setting {@link section} named {@link name} in the {@link joplinSettings}.
   *
   * This is a slightly cleaner way to register a {@link SettingSection}
   * along with its associated {@link SettingItem}s.
   * The two combine into a single {@link ExtendedSettingSection} and register together.
   */
  export async function register<T>(
    joplinSettings: ActualJoplinSettings,
    name: string,
    section: ExtendedSettingSection<T>,
  ): Promise<void> {
    // Remove the merged settings
    await joplinSettings.registerSection(name, Dicts.deleteKey(section, "settings"))

    // Add back the missing `section` tag that associates each setting with its section
    await joplinSettings.registerSettings(
      Dicts.map(section.settings, (setting) => ({ ...setting, section: name })),
    )
  }
}
