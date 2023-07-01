import { CmExtensionRequestHandler } from "@cm-extension-ipc/model/handler"
import { PingRequest } from "@cm-extension-ipc/model/messages"

export interface CmExtensionClientProps {
  readonly call: CmExtensionRequestHandler
}

/**
 * Calls the CodeMirror extension over inter-process communication using the given {@link call}.
 */
export class CmExtensionClient {
  private readonly call: CmExtensionRequestHandler

  static create(props: CmExtensionClientProps): CmExtensionClient {
    return new CmExtensionClient(props)
  }

  private constructor(props: CmExtensionClientProps) {
    this.call = props.call
  }

  /**
   * Pings the CodeMirror extension to check that it's reachable.
   */
  async ping(): Promise<void> {
    await this.call(PingRequest.of())
  }
}
