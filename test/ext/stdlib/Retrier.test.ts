import { mock, when } from "strong-mock"
import { beforeEach, describe, expect, it } from "vitest"

import { Retrier } from "@ext/stdlib/Retrier"

import { FakeWindow } from "test-support/fakes/dom/FakeWindow"

describe("Retrier", () => {
  describe("retry", () => {
    let fakeWindow: FakeWindow
    const mockFn = mock<() => Promise<string>>()
    const mockIsComplete = mock<(response: string) => boolean>()
    let retrier: Retrier

    beforeEach(() => {
      fakeWindow = FakeWindow.create()
      retrier = Retrier.create({ window: fakeWindow })
    })

    it("retries fn exponentially", async () => {
      when(() => mockFn())
        .thenResolve("response")
        .times(3)
      when(() => mockIsComplete("response")).thenReturn(false)
      when(() => mockIsComplete("response")).thenReturn(false)
      when(() => mockIsComplete("response")).thenReturn(true)

      const response = await retrier.retry({
        fn: mockFn,
        isSuccess: mockIsComplete,
        startDelayMillis: 1,
      })

      const [firstTimeout, secondTimeout] = fakeWindow.ext.setTimeouts
      expect(firstTimeout.timeout).toBe(1)
      expect(secondTimeout.timeout).toBe(2)

      expect(response).toBe("response")
    })

    it("does not retry when fn completes the first time", async () => {
      when(() => mockFn()).thenResolve("response")
      when(() => mockIsComplete("response")).thenReturn(true)

      const response = await retrier.retry({
        fn: mockFn,
        isSuccess: mockIsComplete,
        startDelayMillis: 1,
      })

      expect(response).toBe("response")
      expect(fakeWindow.ext.setTimeouts).toBeEmpty()
    })

    it("throw Error when start delay is invalid", async () => {
      await expect(
        retrier.retry({
          fn: mockFn,
          isSuccess: mockIsComplete,
          startDelayMillis: -1,
        }),
      ).rejects.toThrowError()
    })
  })
})
