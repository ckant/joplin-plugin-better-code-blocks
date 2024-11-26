import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { ContentScript, ContentScriptProps } from "@content-script/ContentScript"

import { CmExtension as Cm5Extension } from "@cm-extension/cm5/CmExtension"

import { Vitest } from "test-support/ext/vitest/Vitest"
import { FakeEditor } from "test-support/fakes/codemirror/cm5/FakeEditor"
import { FakeCodeMirror5 } from "test-support/fakes/joplin/FakeCodeMirror5"
import { FakeCodeMirror6 } from "test-support/fakes/joplin/FakeCodeMirror6"

describe("ContentScript", () => {
  describe("create", () => {
    it("defines cm5 plugin option", () => {
      const fakeCodeMirror = FakeCodeMirror5.create()
      const mockCm6Extension = mock<void>()
      const mockCm5Extension = mock<Cm5Extension>()

      ContentScript.create({
        createCm6Extension: () => Promise.resolve(mockCm6Extension),
        createCm5Extension: () => Promise.resolve(mockCm5Extension),
        styles: [],
      }).plugin(fakeCodeMirror)

      expect(fakeCodeMirror.ext.option).toBeDefined()
      const option = fakeCodeMirror.ext.option!
      expect(option.name).toBe("enableBetterCodeBlocks")
      expect(option.default_).toBeFalse()
      expect(option.updateFunc).toBeDefined()
    })

    it("doesn't define cm5 extension if passed false", async () => {
      const fakeCodeMirror = FakeCodeMirror5.create()
      const mockCreateCm6Extension = mock<ContentScriptProps["createCm6Extension"]>()
      const mockCreateCm5Extension = mock<ContentScriptProps["createCm5Extension"]>()

      ContentScript.create({
        createCm6Extension: mockCreateCm6Extension,
        createCm5Extension: mockCreateCm5Extension,
        styles: [],
      }).plugin(fakeCodeMirror)

      fakeCodeMirror.ext.option!.updateFunc(FakeEditor.create(), false, "unused")
      await Vitest.settlePendingPromises()
    })

    it("creates cm5 plugin extension", async () => {
      const fakeCodeMirror = FakeCodeMirror5.create()
      const fakeEditor = FakeEditor.create()
      const mockCreateCm6Extension = mock<ContentScriptProps["createCm6Extension"]>()
      const mockCreateCm5Extension = mock<ContentScriptProps["createCm5Extension"]>()

      when(() => mockCreateCm5Extension(fakeCodeMirror, fakeEditor)).thenResolve(mock())

      ContentScript.create({
        createCm6Extension: mockCreateCm6Extension,
        createCm5Extension: mockCreateCm5Extension,
        styles: [],
      }).plugin(fakeCodeMirror)

      fakeCodeMirror.ext.option!.updateFunc(fakeEditor, true, "unused")
      await Vitest.settlePendingPromises()
    })

    it("creates cm6 plugin extension", async () => {
      const fakeCodeMirror = FakeCodeMirror6.create()
      const mockCreateCm6Extension = mock<ContentScriptProps["createCm6Extension"]>()
      const mockCreateCm5Extension = mock<ContentScriptProps["createCm5Extension"]>()

      when(() => mockCreateCm6Extension(fakeCodeMirror)).thenResolve(mock())

      ContentScript.create({
        createCm6Extension: mockCreateCm6Extension,
        createCm5Extension: mockCreateCm5Extension,
        styles: [],
      }).plugin(fakeCodeMirror)

      await Vitest.settlePendingPromises()
    })
  })

  describe("assets", () => {
    it("returns assets", () => {
      const contentScript = ContentScript.create({
        createCm6Extension: () => Promise.resolve(mock<void>()),
        createCm5Extension: () => Promise.resolve(mock<Cm5Extension>()),
        styles: ["asset"],
      })

      expect(contentScript.assets(undefined)).toStrictEqual([{ name: "asset" }])
    })
  })

  describe("codeMirrorOptions", () => {
    it("returns options", () => {
      const contentScript = ContentScript.create({
        createCm6Extension: () => Promise.resolve(mock<void>()),
        createCm5Extension: () => Promise.resolve(mock<Cm5Extension>()),
        styles: [],
      })

      expect(contentScript.codeMirrorOptions).toStrictEqual({ ["enableBetterCodeBlocks"]: true })
    })
  })

  describe("codeMirrorResources", () => {
    it("returns no resources", () => {
      const contentScript = ContentScript.create({
        createCm6Extension: () => Promise.resolve(mock<void>()),
        createCm5Extension: () => Promise.resolve(mock<Cm5Extension>()),
        styles: [],
      })

      expect(contentScript.codeMirrorResources).toBeEmpty()
    })
  })
})
