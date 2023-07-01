/**
 * Kinds of CodeMirror extension requests / responses.
 */
export type CmExtensionMessageKind = "ping"

/**
 * CodeMirror extension requests / responses.
 */
interface CmExtensionRequestMap<K extends CmExtensionMessageKind> {
  readonly ping: { readonly kind: K }
}
interface CmExtensionResponseMap {
  readonly ping: Promise<{ readonly kind: "ping" }>
}

/**
 * Base type for a CodeMirror extension request / response.
 */
export type CmExtensionRequest<K extends CmExtensionMessageKind> = CmExtensionRequestMap<K>[K]
export type CmExtensionResponse<K extends CmExtensionMessageKind> = CmExtensionResponseMap[K]
