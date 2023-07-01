import { Settings } from "@joplin-plugin-ipc/model/types"

/**
 * Kinds of Joplin plugin requests / responses.
 */
export type PluginMessageKind = "ping" | "getSettings"

/**
 * Joplin plugin requests / responses.
 */
interface PluginRequestMap<K extends PluginMessageKind> {
  readonly ping: { readonly kind: K }
  readonly getSettings: { readonly kind: K }
}
interface PluginResponseMap {
  readonly ping: Promise<{ readonly kind: "ping" }>
  readonly getSettings: Promise<{ readonly kind: "getSettings"; readonly settings: Settings }>
}

/**
 * Base type for a Joplin plugin request / response.
 */
export type PluginRequest<K extends PluginMessageKind> = PluginRequestMap<K>[K]
export type PluginResponse<K extends PluginMessageKind> = PluginResponseMap[K]
