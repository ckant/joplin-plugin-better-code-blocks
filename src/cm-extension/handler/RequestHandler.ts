import { CmExtensionRequestHandler } from "@cm-extension-ipc/model/handler"
import { PingRequest, PingResponse } from "@cm-extension-ipc/model/messages"

/**
 * Handles requests to the Code Mirror extension (through inter-process communication).
 */
export class RequestHandler {
  static create(): RequestHandler {
    return new RequestHandler()
  }

  private constructor() {
    // empty
  }

  /**
   * Handles a Code Mirror extension {@link request} and returns a response.
   */
  handle: CmExtensionRequestHandler = (request) => {
    return (this[request.kind] as CmExtensionRequestHandler)(request)
  }

  /**
   * Handles a {@link _pingRequest} and returns a {@link PingResponse}.
   */
  async ping(_pingRequest: PingRequest): Promise<PingResponse> {
    return Promise.resolve(PingResponse.of())
  }
}
