import { CmExtensionRequest, CmExtensionResponse } from "@cm-extension-ipc/model/base"

/**
 * A request to ping the CodeMirror extension to check that it's reachable.
 */
export type PingRequest = CmExtensionRequest<"ping">
export namespace PingRequest {
  export function of(): PingRequest {
    return { kind: "ping" }
  }
}

/**
 * A response for a {@link PingResponse}.
 */
export type PingResponse = Awaited<CmExtensionResponse<"ping">>
export namespace PingResponse {
  export function of(): PingResponse {
    return { kind: "ping" }
  }
}
