import { mock, when } from "strong-mock"
import { beforeEach, describe, expect, it } from "vitest"

import { Completer } from "@cm-extension/cm5/completer/Completer"
import { CompleteHandler } from "@cm-extension/cm5/handler/CompleteHandler"
import { Origin } from "@cm-extension/cm5/model/Origin"

import { FakeEditor } from "test-support/fakes/codemirror/cm5/FakeEditor"
import { FakeKeyboardEvent } from "test-support/fakes/dom/FakeKeyboardEvent"

describe("CompleteHandler", () => {
  describe("completeOnEnter", () => {
    let fakeEditor: FakeEditor
    const mockCompleter = mock<Completer>()
    let completeHandler: CompleteHandler

    beforeEach(() => {
      fakeEditor = FakeEditor.create()
      completeHandler = CompleteHandler.create({ completer: mockCompleter })
    })

    it("completes on enter and completion", () => {
      const fakeKeyboardEvent = FakeKeyboardEvent.create({ code: "Enter" })
      when(() => mockCompleter.complete(fakeEditor.getDoc(), Origin.CompleteHandler)).thenReturn(
        true,
      )

      completeHandler.completeOnEnter(fakeEditor, fakeKeyboardEvent)

      expect(fakeEditor.ext.operation).toBeDefined()
      expect(fakeKeyboardEvent.ext.defaultPrevented).toBeTrue()
    })

    it("doesn't complete when not enter", () => {
      completeHandler.completeOnEnter(fakeEditor, FakeKeyboardEvent.create({ code: "Space" }))
    })

    it("doesn't prevent defaults when no completion", () => {
      const fakeKeyboardEvent = FakeKeyboardEvent.create({ code: "Enter" })

      when(() => mockCompleter.complete(fakeEditor.getDoc(), Origin.CompleteHandler)).thenReturn(
        false,
      )

      completeHandler.completeOnEnter(fakeEditor, fakeKeyboardEvent)

      expect(fakeKeyboardEvent.ext.defaultPrevented).toBeFalse()
    })
  })
})
