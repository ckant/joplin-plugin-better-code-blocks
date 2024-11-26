import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { JoplinPluginClient } from "@joplin-plugin-ipc/JoplinPluginClient"
import { PluginRequestHandler } from "@joplin-plugin-ipc/model/handler"
import {
  GetSettingsRequest,
  GetSettingsResponse,
  PingRequest,
  PingResponse,
} from "@joplin-plugin-ipc/model/messages"

import { FakeRetrier } from "test-support/fakes/stdlib/FakeRetrier"
import { Any } from "test-support/fixtures/cm5/Any"

describe("JoplinPluginClient", () => {
  describe("new", () => {
    it("establishes connection", async () => {
      const fakeRetrier = FakeRetrier.create()
      const mockCall = mock<PluginRequestHandler>()
      when(() => mockCall<"ping">(PingRequest.of()))
        .thenResolve(undefined as unknown as PingResponse)
        .twice()
      when(() => mockCall<"ping">(PingRequest.of()))
        .thenResolve(PingResponse.of())
        .twice()

      await JoplinPluginClient.create({
        call: mockCall,
        retrier: fakeRetrier,
      }).ping()

      expect(fakeRetrier.ext.result).toStrictEqual({
        startDelayMillis: 50,
        retryCount: 2,
        response: PingResponse.of(),
      })
    })
  })

  describe("ping", () => {
    it("returns successfully", async () => {
      const mockCall = mock<PluginRequestHandler>()
      when(() => mockCall<"ping">(PingRequest.of()))
        .thenResolve(PingResponse.of())
        .twice()

      await expect(
        JoplinPluginClient.create({ call: mockCall, retrier: Any.retrier() }).ping(),
      ).resolves.toBeUndefined()
    })
  })

  describe("getSettings", () => {
    it("returns plugin settings", async () => {
      const mockCall = mock<PluginRequestHandler>()
      when(() => mockCall<"ping">(PingRequest.of())).thenResolve(PingResponse.of())
      when(() => mockCall<"getSettings">(GetSettingsRequest.of())).thenResolve(
        GetSettingsResponse.of(Any.pluginSettings()),
      )

      await expect(
        JoplinPluginClient.create({
          call: mockCall,
          retrier: Any.retrier(),
        }).getSettings(),
      ).resolves.toStrictEqual(Any.pluginSettings())
    })
  })
})
