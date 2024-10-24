/**
 * The Joplin plugin settings.
 *
 * Duplicate of {@link PluginSettings} to decouple the Joplin plugin and the CodeMirror extension.
 * The CodeMirror extension can remain standalone and couple solely with `joplin-plugin-ipc`.
 *
 * @see PluginSettings
 */
export interface Settings {
  readonly completion: "enabled" | "disabled"
  readonly copyFormat: "code" | "fencedCode"
  readonly cornerStyle: "square" | "round"
  readonly excludedLanguages: readonly string[]
  readonly rendering: "enabled" | "disabled"
  readonly renderLayout: "minimal" | "standard"
  readonly selectAllCapturing: "enabled" | "disabled"
}
