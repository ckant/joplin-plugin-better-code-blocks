import { EditorChange, EditorSelectionChange } from "codemirror"
import { mock, when } from "strong-mock"
import { beforeEach, describe, expect, it } from "vitest"

import { CmExtensionRequestHandler } from "@cm-extension-ipc/model/handler"
import { PingRequest, PingResponse } from "@cm-extension-ipc/model/messages"

import { CmExtension } from "@cm-extension/cm5/CmExtension"
import { CompleteHandler } from "@cm-extension/cm5/handler/CompleteHandler"
import { RenderHandler } from "@cm-extension/cm5/handler/RenderHandler"
import { RequestHandler } from "@cm-extension/cm5/handler/RequestHandler"
import { SelectHandler } from "@cm-extension/cm5/handler/SelectHandler"
import { Config } from "@cm-extension/cm5/model/Config"
import { Origin } from "@cm-extension/cm5/model/Origin"

import { FakeEditor } from "test-support/fakes/codemirror/cm5/FakeEditor"
import { FakeKeyboardEvent } from "test-support/fakes/dom/FakeKeyboardEvent"
import { FakeCodeMirror5 } from "test-support/fakes/joplin/FakeCodeMirror5"
import { Any } from "test-support/fixtures/cm5/Any"

describe("CmExtension", () => {
  let fakeCodeMirror: FakeCodeMirror5
  let fakeEditor: FakeEditor
  const mockCompleteHandler = mock<CompleteHandler>()
  const mockRenderHandler = mock<RenderHandler>()
  const mockRequestHandler = mock<RequestHandler>()
  const mockSelectHandler = mock<SelectHandler>()

  beforeEach(() => {
    fakeCodeMirror = FakeCodeMirror5.create()
    fakeEditor = FakeEditor.create()
  })

  function createWithConfig(config: Partial<Config>): CmExtension {
    return CmExtension.create({
      codeMirror: fakeCodeMirror,
      editor: fakeEditor,
      config: Any.configWith(config),
      completeHandler: mockCompleteHandler,
      renderHandler: mockRenderHandler,
      requestHandler: mockRequestHandler,
      selectHandler: mockSelectHandler,
    })
  }

  describe("create", () => {
    it("enables rendering", () => {
      const change = { origin: Origin.RenderHandler } as EditorChange
      when(() => mockRenderHandler.renderOnChange(fakeEditor, change)).thenReturn()
      when(() => mockRenderHandler.renderNow(fakeEditor)).thenReturn()

      createWithConfig({
        rendering: "enabled",
        completion: "disabled",
        selectAllCapturing: "disabled",
      })
      fakeEditor.ext.dispatchEvent("change", fakeEditor, change)
    })

    it("enables completion", () => {
      const fakeKeyboardEvent = FakeKeyboardEvent.create()
      when(() => mockCompleteHandler.completeOnEnter(fakeEditor, fakeKeyboardEvent)).thenReturn()

      createWithConfig({
        rendering: "disabled",
        completion: "enabled",
        selectAllCapturing: "disabled",
      })
      fakeEditor.ext.dispatchEvent("keydown", fakeEditor, fakeKeyboardEvent)
    })

    it("enables selectAllCapturing", () => {
      const mockEditorSelectionChange = mock<EditorSelectionChange>()
      when(() =>
        mockSelectHandler.selectOnSelectAll(fakeEditor.getDoc(), mockEditorSelectionChange),
      ).thenReturn()

      createWithConfig({
        rendering: "disabled",
        completion: "disabled",
        selectAllCapturing: "enabled",
      })
      fakeEditor.ext.dispatchEvent("beforeSelectionChange", fakeEditor, mockEditorSelectionChange)
    })

    it("does nothing when options are disabled", () => {
      createWithConfig({
        rendering: "disabled",
        completion: "disabled",
        selectAllCapturing: "disabled",
      })

      expect(fakeEditor.ext.eventHandlers).toBeEmpty()
    })
  })

  it("defines extension", async () => {
    when(() => mockRequestHandler.handle(PingRequest.of())).thenResolve(PingResponse.of())

    createWithConfig({
      cornerStyle: "round",
      renderLayout: "standard",
      rendering: "disabled",
      completion: "disabled",
      selectAllCapturing: "disabled",
    })

    expect(fakeCodeMirror.ext.extension).toBeDefined()
    const extension = fakeCodeMirror.ext.extension!
    expect(extension.name).toBe("BetterCodeBlocks")
    expect(extension.value).toBeDefined()

    const requestHandler = fakeCodeMirror.ext.extension!.value as CmExtensionRequestHandler
    await expect(requestHandler(PingRequest.of())).resolves.toStrictEqual(PingResponse.of())

    expect(fakeEditor.ext.wrapperData.cbCornerStyle).toBe("round")
    expect(fakeEditor.ext.wrapperData.cbRendering).toBe("disabled")
    expect(fakeEditor.ext.wrapperData.cbRenderLayout).toBe("standard")
  })
})
