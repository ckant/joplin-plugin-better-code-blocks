import {
  CmExtensionMessageKind,
  CmExtensionRequest,
  CmExtensionResponse,
} from "@cm-extension-ipc/model/base"

/**
 * Handles a {@link CmExtensionRequest} and returns the corresponding {@link CmExtensionResponse}.
 */
export type CmExtensionRequestHandler = <K extends CmExtensionMessageKind>(
  request: CmExtensionRequest<K>,
) => CmExtensionResponse<K>
