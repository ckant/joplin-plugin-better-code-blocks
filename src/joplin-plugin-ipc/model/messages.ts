import { PluginRequest, PluginResponse } from "@joplin-plugin-ipc/model/base"
import { Settings } from "@joplin-plugin-ipc/model/types"

/**
 * A request to get the (latest) Joplin plugin {@link Settings}.
 */
export type GetSettingsRequest = PluginRequest<"getSettings">
export namespace GetSettingsRequest {
  export function of(): GetSettingsRequest {
    return { kind: "getSettings" }
  }
}

/**
 * A response for a {@link GetSettingsRequest} with the latest {@link settings}.
 */
export type GetSettingsResponse = Awaited<PluginResponse<"getSettings">>
export namespace GetSettingsResponse {
  export function of(settings: Settings): GetSettingsResponse {
    return { kind: "getSettings", settings }
  }
}

/**
 * A request to ping the Joplin plugin to check that it's reachable.
 */
export type PingRequest = PluginRequest<"ping">
export namespace PingRequest {
  export function of(): PingRequest {
    return { kind: "ping" }
  }
}

/**
 * A response for a {@link PingRequest}.
 */
export type PingResponse = Awaited<PluginResponse<"ping">>
export namespace PingResponse {
  export function of(): PingResponse {
    return { kind: "ping" }
  }
}
