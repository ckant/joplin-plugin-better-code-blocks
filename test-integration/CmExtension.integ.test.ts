import CodeMirror, { Doc, Editor } from "codemirror"
import { beforeEach, describe, expect, it } from "vitest"

import { CmExtensionRequestHandler } from "@cm-extension-ipc/model/handler"
import { PingRequest, PingResponse } from "@cm-extension-ipc/model/messages"

import { CmExtensions } from "@cm-extension/CmExtensions"

describe("CmExtension integration test", () => {
  let cm: Editor
  let doc: Doc

  beforeEach(() => {
    cm = createEditor()
    doc = cm.getDoc()
    doc.setValue("~~~\n~~~")

    CmExtensions.createDefault({
      codeMirror: CodeMirror,
      editor: cm,
      config: {
        completion: "enabled",
        copyFormat: "code",
        cornerStyle: "square",
        excludedLanguages: [],
        renderLayout: "minimal",
        rendering: "enabled",
        selectAllCapturing: "enabled",
      },
    })
  })

  describe("rendering", () => {
    it("renders immediately", () => {
      expect(doc.getValue()).toBe("\n~~~\n\n~~~\n")
    })

    it("renders on change", () => {
      doc.setValue("~~~\n~~~")
      expect(doc.getValue()).toBe("\n~~~\n\n~~~\n")
    })
  })

  describe("completion", () => {
    it("completes on enter", () => {
      doc.setValue("~~~")
      doc.setCursor({ line: 0, ch: 3 })
      cm.getInputField().dispatchEvent(new KeyboardEvent("keydown", { code: "Enter" }))

      expect(doc.getValue()).toBe("\n~~~\n\n~~~\n")
    })
  })

  describe("select all capturing", () => {
    it("captures select all", () => {
      doc.setValue("\n~~~\nCode\n~~~\n")
      doc.setCursor({ line: 2, ch: 2 })
      doc.setSelection({ line: 0, ch: 0 }, { line: 4, ch: 0 })

      expect(doc.getSelection()).toBe("Code")
    })
  })

  describe("extension", () => {
    it("defines extension", async () => {
      const cmWithExtension = cm as unknown as Record<string, unknown>

      expect("BetterCodeBlocks" in cmWithExtension).toBeTrue()

      const betterCodeBlocks = cmWithExtension.BetterCodeBlocks as CmExtensionRequestHandler
      await expect(betterCodeBlocks(PingRequest.of())).resolves.toEqual(PingResponse.of())
    })
  })

  describe("wrapper dataset", () => {
    it("injects html data attributes", () => {
      expect(cm.getWrapperElement().dataset).toEqual({
        cbCornerStyle: "square",
        cbRendering: "enabled",
        cbRenderLayout: "minimal",
      })
    })
  })
})

function createEditor(): Editor {
  return CodeMirror(document.body, {
    lineNumbers: false,
    mode: "markdown",
  })
}
