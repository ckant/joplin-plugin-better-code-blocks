import { PluginRequestHandler } from "@joplin-plugin-ipc/model/handler"
import {
  GetSettingsRequest,
  GetSettingsResponse,
  PingRequest,
  PingResponse,
} from "@joplin-plugin-ipc/model/messages"

import { PluginSettingsProvider } from "@joplin-plugin/settings/PluginSettingsProvider"

export interface RequestHandlerProps {
  readonly pluginSettingsProvider: PluginSettingsProvider
}

/**
 * Handles requests to the Joplin plugin (through inter-process communication).
 *
 * Returns settings using the {@link pluginSettingsProvider}.
 */
export class RequestHandler {
  private readonly pluginSettingsProvider: PluginSettingsProvider

  static create(props: RequestHandlerProps): RequestHandler {
    return new RequestHandler(props)
  }

  private constructor(props: RequestHandlerProps) {
    this.pluginSettingsProvider = props.pluginSettingsProvider
  }

  /**
   * Handles a Joplin plugin {@link request} and returns a response.
   */
  handle: PluginRequestHandler = (request) => {
    return (this[request.kind] as PluginRequestHandler)(request)
  }

  /**
   * Handles a {@link _pingRequest} and returns a {@link PingResponse}.
   */
  async ping(_pingRequest: PingRequest): Promise<PingResponse> {
    return Promise.resolve(PingResponse.of())
  }

  /**
   * Handles a {@link _getSettingsRequest} and returns a {@link GetSettingsResponse}.
   */
  async getSettings(_getSettingsRequest: GetSettingsRequest): Promise<GetSettingsResponse> {
    return GetSettingsResponse.of(await this.pluginSettingsProvider.provide())
  }
}
