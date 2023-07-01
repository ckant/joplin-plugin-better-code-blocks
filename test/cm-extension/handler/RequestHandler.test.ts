import { describe, expect, it } from "vitest"

import { PingRequest, PingResponse } from "@cm-extension-ipc/model/messages"

import { Any } from "test-support/fixtures/Any"

describe("RequestHandler", () => {
  describe("handle", () => {
    it("handles ping", async () => {
      await expect(Any.requestHandler().handle(PingRequest.of())).resolves.toStrictEqual(
        PingResponse.of(),
      )
    })
  })

  describe("ping", () => {
    it("returns ping response", async () => {
      await expect(Any.requestHandler().ping(PingRequest.of())).resolves.toStrictEqual(
        PingResponse.of(),
      )
    })
  })
})
