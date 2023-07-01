/**
 * Settings for the {@link JoplinPlugin}.
 *
 * Currently, this is a duplicate of the CodeMirror extension {@link Config}.
 * This duplication exists to decouple the Joplin plugin from the CodeMirror extension.
 *
 * @see Config
 */
export interface PluginSettings {
  readonly completion: "enabled" | "disabled"
  readonly copyFormat: "code" | "fencedCode"
  readonly cornerStyle: "square" | "round"
  readonly excludedLanguages: readonly string[]
  readonly rendering: "enabled" | "disabled"
  readonly renderLayout: "minimal" | "standard"
  readonly selectAllCapturing: "enabled" | "disabled"
}
