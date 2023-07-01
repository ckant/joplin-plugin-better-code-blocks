import { def } from "@ext/stdlib/existence"
import { Retrier } from "@ext/stdlib/Retrier"

import { PluginRequestHandler } from "@joplin-plugin-ipc/model/handler"
import { GetSettingsRequest, PingRequest } from "@joplin-plugin-ipc/model/messages"
import { Settings } from "@joplin-plugin-ipc/model/types"

const retryStartDelayMillis = 50

export interface JoplinPluginClientProps {
  readonly call: PluginRequestHandler
  readonly retrier: Retrier
}

/**
 * Calls the Joplin plugin over inter-process communication using the given {@link call}.
 *
 * The initial connection to the Joplin plugin is continuously re-attempted
 * using the given {@link Retrier#retry} strategy.
 *
 * The connection retries are necessary due to the way Joplin registers content scripts
 * and sets up inter-process communication with Joplin plugins.
 *
 * Joplin executes content script initialization before it sets up inter-process communication.
 * However, content script initialization (often) relies on Joplin state (e.g. plugin config)
 * which is only retrievable through that inter-process communication.
 *
 * A solution to this is to asynchronously initialize the content script.
 * This completes the initialization and allows Joplin to proceed with setup.
 * The content script can then simply await (and retry) the connection.
 */
export class JoplinPluginClient {
  private readonly call: PluginRequestHandler

  static create(props: JoplinPluginClientProps): JoplinPluginClient {
    return new JoplinPluginClient(props)
  }

  private constructor(props: JoplinPluginClientProps) {
    this.call = connectedCall(props)
  }

  /**
   * Gets the (latest) Joplin plugin {@link Settings}.
   */
  async getSettings(): Promise<Settings> {
    return (await this.call<"getSettings">(GetSettingsRequest.of())).settings
  }

  /**
   * Pings the Joplin plugin to check that it's reachable.
   */
  async ping(): Promise<void> {
    await this.call(PingRequest.of())
  }
}

function connectedCall(props: JoplinPluginClientProps): PluginRequestHandler {
  const { call } = props

  const connection = establishConnection(props)
  return ((request) => connection.then(async () => call(request))) as PluginRequestHandler
}

async function establishConnection({ call, retrier }: JoplinPluginClientProps): Promise<void> {
  // An un-established inter-process communication channel immediately returns nil
  // Continuously ping the plugin (with exponential backoff) until a non-nil response comes back
  await retrier.retry({
    fn: async () => await call(PingRequest.of()),
    isSuccess: def,
    startDelayMillis: retryStartDelayMillis,
  })
}
