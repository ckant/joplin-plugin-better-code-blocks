import JoplinContentScripts from "api/JoplinContentScripts"
import JoplinPlugins from "api/JoplinPlugins"
import { ContentScriptType, Script } from "api/types"
import { It, mock, when } from "strong-mock"
import { Dicts } from "@ts-belt"
import { beforeEach, describe, expect, it } from "vitest"

import { CmExtensionClient } from "@cm-extension-ipc/CmExtensionClient"

import { RequestHandler } from "@joplin-plugin/handler/RequestHandler"
import { JoplinPlugin } from "@joplin-plugin/JoplinPlugin"
import { PluginSettings } from "@joplin-plugin/settings/PluginSettings"
import { PluginSettingSection } from "@joplin-plugin/settings/PluginSettingSection"

import { FakeJoplinSettings } from "test-support/fakes/joplin/FakeJoplinSettings"

describe("JoplinPlugin", () => {
  const mockCmExtensionClient = mock<CmExtensionClient>()
  const mockJoplinContentScripts = mock<JoplinContentScripts>()
  const mockJoplinPlugins = mock<JoplinPlugins>()
  const mockRequestHandler = mock<RequestHandler>()

  let fakeJoplinSettings: FakeJoplinSettings

  let script: Script

  beforeEach(async () => {
    fakeJoplinSettings = FakeJoplinSettings.create()

    const captureScript = It.willCapture<Script>()
    when(() => mockJoplinPlugins.register(captureScript)).thenResolve()

    await JoplinPlugin.register<PluginSettings>({
      cmExtensionClient: mockCmExtensionClient,
      contentScript: {
        id: "id",
        path: "path",
      },
      joplin: {
        contentScripts: mockJoplinContentScripts,
        plugins: mockJoplinPlugins,
        settings: fakeJoplinSettings,
      },
      requestHandler: mockRequestHandler,
      settingSection: PluginSettingSection,
    })

    script = captureScript.value!
  })

  describe("register", () => {
    it("register onStart", async () => {
      const captureMessageHandler = It.willCapture<unknown>()

      when(() =>
        mockJoplinContentScripts.register(ContentScriptType.CodeMirrorPlugin, "id", "path"),
      ).thenResolve()

      when(() => mockJoplinContentScripts.onMessage("id", captureMessageHandler)).thenResolve()

      await script.onStart!(undefined)

      expect(fakeJoplinSettings.ext.settingSections).toContainExactlyEntry(
        "BetterCodeBlocks",
        Dicts.deleteKey(PluginSettingSection, "settings"),
      )
      expect(fakeJoplinSettings.ext.settingItems).toStrictEqual(
        new Map(
          Object.entries(
            Dicts.map(PluginSettingSection.settings, (setting) => ({
              ...setting,
              section: "BetterCodeBlocks",
            })),
          ),
        ),
      )
    })
  })
})
