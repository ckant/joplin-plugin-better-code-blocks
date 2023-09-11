import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { ContentScript, ContentScriptProps } from "@content-script/ContentScript"

import { CmExtension } from "@cm-extension/CmExtension"

import { Vitest } from "test-support/ext/vitest/Vitest"
import { FakeEditor } from "test-support/fakes/codemirror/FakeEditor"
import { FakeCodeMirror } from "test-support/fakes/joplin/FakeCodeMirror"

describe("ContentScript", () => {
  describe("create", () => {
    it("defines plugin option", () => {
      const fakeCodeMirror = FakeCodeMirror.create()
      const mockCmExtension = mock<CmExtension>()

      ContentScript.create({
        createCmExtension: () => Promise.resolve(mockCmExtension),
        styles: [],
      }).plugin(fakeCodeMirror)

      expect(fakeCodeMirror.ext.option).toBeDefined()
      const option = fakeCodeMirror.ext.option!
      expect(option.name).toBe("enableBetterCodeBlocks")
      expect(option.default_).toBeFalse()
      expect(option.updateFunc).toBeDefined()
    })

    it("doesn't define extension if passed false", async () => {
      const fakeCodeMirror = FakeCodeMirror.create()
      const mockCreateCmExtension = mock<ContentScriptProps["createCmExtension"]>()

      ContentScript.create({
        createCmExtension: mockCreateCmExtension,
        styles: [],
      }).plugin(fakeCodeMirror)

      fakeCodeMirror.ext.option!.updateFunc(FakeEditor.create(), false, "unused")
      await Vitest.settlePendingPromises()
    })

    it("defines plugin extension", async () => {
      const fakeCodeMirror = FakeCodeMirror.create()
      const fakeEditor = FakeEditor.create()
      const mockCreateCmExtension = mock<ContentScriptProps["createCmExtension"]>()

      when(() => mockCreateCmExtension(fakeCodeMirror, fakeEditor)).thenResolve(mock())

      ContentScript.create({
        createCmExtension: mockCreateCmExtension,
        styles: [],
      }).plugin(fakeCodeMirror)

      fakeCodeMirror.ext.option!.updateFunc(fakeEditor, true, "unused")
      await Vitest.settlePendingPromises()
    })
  })

  describe("assets", () => {
    it("returns assets", () => {
      const contentScript = ContentScript.create({
        createCmExtension: () => Promise.resolve(mock<CmExtension>()),
        styles: ["asset"],
      })

      expect(contentScript.assets(undefined)).toStrictEqual([{ name: "asset" }])
    })
  })

  describe("codeMirrorOptions", () => {
    it("returns options", () => {
      const contentScript = ContentScript.create({
        createCmExtension: () => Promise.resolve(mock<CmExtension>()),
        styles: [],
      })

      expect(contentScript.codeMirrorOptions).toStrictEqual({ ["enableBetterCodeBlocks"]: true })
    })
  })

  describe("codeMirrorResources", () => {
    it("returns no resources", () => {
      const contentScript = ContentScript.create({
        createCmExtension: () => Promise.resolve(mock<CmExtension>()),
        styles: [],
      })

      expect(contentScript.codeMirrorResources).toBeEmpty()
    })
  })
})
