import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { CmExtensionClient } from "@cm-extension-ipc/CmExtensionClient"
import { CmExtensionRequestHandler } from "@cm-extension-ipc/model/handler"
import { PingRequest, PingResponse } from "@cm-extension-ipc/model/messages"

describe("CmExtensionClient", () => {
  describe("ping", () => {
    it("returns successfully", async () => {
      const mockRequestHandler = mock<CmExtensionRequestHandler>()
      when(() => mockRequestHandler(PingRequest.of())).thenResolve(PingResponse.of())

      await expect(
        CmExtensionClient.create({ call: mockRequestHandler }).ping(),
      ).resolves.toBeUndefined()
    })
  })
})
