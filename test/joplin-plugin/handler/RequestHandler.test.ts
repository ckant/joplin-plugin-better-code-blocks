import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import {
  GetSettingsRequest,
  GetSettingsResponse,
  PingRequest,
  PingResponse,
} from "@joplin-plugin-ipc/model/messages"

import { RequestHandler } from "@joplin-plugin/handler/RequestHandler"
import { PluginSettingsProvider } from "@joplin-plugin/settings/PluginSettingsProvider"

import { Any } from "test-support/fixtures/cm5/Any"

describe("RequestHandler", () => {
  const mockPluginSettingsProvider = mock<PluginSettingsProvider>()
  const pluginService: RequestHandler = RequestHandler.create({
    pluginSettingsProvider: mockPluginSettingsProvider,
  })

  describe("handle", () => {
    it("handles ping", async () => {
      await expect(pluginService.handle(PingRequest.of())).resolves.toStrictEqual(PingResponse.of())
    })

    it("handles getSettings", async () => {
      when(() => mockPluginSettingsProvider.provide()).thenResolve(Any.pluginSettings())
      await expect(pluginService.handle(GetSettingsRequest.of())).resolves.toStrictEqual(
        GetSettingsResponse.of(Any.pluginSettings()),
      )
    })
  })

  describe("ping", () => {
    it("returns ping response", async () => {
      await expect(pluginService.ping(PingRequest.of())).resolves.toStrictEqual(PingResponse.of())
    })
  })

  describe("getSettings", () => {
    it("returns settings", async () => {
      when(() => mockPluginSettingsProvider.provide()).thenResolve(Any.pluginSettings())

      await expect(pluginService.getSettings(GetSettingsRequest.of())).resolves.toStrictEqual(
        GetSettingsResponse.of(Any.pluginSettings()),
      )
    })
  })
})
