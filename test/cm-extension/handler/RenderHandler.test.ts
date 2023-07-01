import { EditorChange } from "codemirror"
import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { RenderHandler } from "@cm-extension/handler/RenderHandler"
import { Origin } from "@cm-extension/model/Origin"
import { Renderer } from "@cm-extension/renderer/Renderer"

import { FakeEditor } from "test-support/fakes/codemirror/FakeEditor"

describe("RenderHandler", () => {
  describe("renderOnChange", () => {
    it("renders", () => {
      const fakeEditor = FakeEditor.create()
      const mockRenderer = mock<Renderer>()

      when(() => mockRenderer.render(fakeEditor.getDoc(), Origin.RenderHandler)).thenReturn()

      RenderHandler.create({
        renderer: mockRenderer,
      }).renderOnChange(fakeEditor, { origin: "not renderer" } as EditorChange)

      expect(fakeEditor.ext.operation).toBeDefined()
    })

    it("doesn't render when change caused by itself", () => {
      const fakeEditor = FakeEditor.create()
      const mockRenderer = mock<Renderer>()

      RenderHandler.create({
        renderer: mockRenderer,
      }).renderOnChange(fakeEditor, { origin: Origin.RenderHandler } as EditorChange)
    })
  })

  describe("renderNow", () => {
    it("renders", () => {
      const fakeEditor = FakeEditor.create()
      const mockRenderer = mock<Renderer>()

      when(() => mockRenderer.render(fakeEditor.getDoc(), Origin.RenderHandler)).thenReturn()

      RenderHandler.create({
        renderer: mockRenderer,
      }).renderNow(fakeEditor)

      expect(fakeEditor.ext.operation).toBeDefined()
    })
  })
})
