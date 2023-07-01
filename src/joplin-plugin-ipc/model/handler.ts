import { PluginMessageKind, PluginRequest, PluginResponse } from "@joplin-plugin-ipc/model/base"

/**
 * Handles a {@link PluginRequest} and returns the corresponding {@link PluginResponse}.
 */
export type PluginRequestHandler = <K extends PluginMessageKind>(
  request: PluginRequest<K>,
) => PluginResponse<K>
