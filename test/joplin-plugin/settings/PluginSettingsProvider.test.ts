import { describe, expect, it } from "vitest"

import { PluginSettings } from "@joplin-plugin/settings/PluginSettings"
import { PluginSettingsProvider } from "@joplin-plugin/settings/PluginSettingsProvider"

import { FakeJoplinSettings } from "test-support/fakes/joplin/FakeJoplinSettings"

describe("PluginSettingsProvider", () => {
  describe("provide", () => {
    it("provides settings", async () => {
      const fakeJoplinSettings = FakeJoplinSettings.create({
        values: {
          completedLanguages: " c , c++, c-- ",
          completion: "enabled",
          copyFormat: "fencedCode",
          cornerStyle: "round",
          excludedLanguages: " a , b , c ",
          rendering: "disabled",
          renderLayout: "minimal",
          selectAllCapturing: "enabled",
        },
      })

      await expect(
        PluginSettingsProvider.create({
          joplinSettings: fakeJoplinSettings,
        }).provide(),
      ).resolves.toStrictEqual({
        completedLanguages: ["c", "c++", "c--"],
        completion: "enabled",
        copyFormat: "fencedCode",
        cornerStyle: "round",
        excludedLanguages: ["a", "b", "c"],
        rendering: "disabled",
        renderLayout: "minimal",
        selectAllCapturing: "enabled",
      } satisfies PluginSettings)
    })
  })
})
