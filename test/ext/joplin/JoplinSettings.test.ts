import { ExtendedSettingSection, SettingItem, SettingItemType, SettingSection } from "api/types"
import { describe, expect, it } from "vitest"

import { JoplinSettings } from "@ext/joplin/JoplinSettings"

import { FakeJoplinSettings } from "test-support/fakes/joplin/FakeJoplinSettings"

describe("JoplinSettings", () => {
  describe("register", () => {
    it("registers section and settings", async () => {
      const fakeJoplinSettings = FakeJoplinSettings.create()

      await JoplinSettings.register<FooSettings>(fakeJoplinSettings, "FooSection", FooSection)

      expect(fakeJoplinSettings.ext.settingSections).toContainExactlyEntry("FooSection", {
        name: FooSection.name,
        label: FooSection.label,
        description: FooSection.description,
        iconName: FooSection.iconName,
      } satisfies SettingSection)

      expect(fakeJoplinSettings.ext.settingItems).toStrictEqual(
        new Map(
          Object.entries({
            a: { section: "FooSection", ...FooSection.settings.a },
            b: { section: "FooSection", ...FooSection.settings.b },
          } satisfies Record<string, SettingItem>),
        ),
      )
    })
  })
})

interface FooSettings {
  readonly a: string
  readonly b: "1" | "2"
}

const FooSection = {
  name: "name",
  label: "label",
  description: "FooSection.description",
  iconName: "FooSection.iconName",
  settings: {
    a: {
      type: SettingItemType.String,
      public: true,
      value: "a.value",
      label: "a.label",
      description: "a.description",
    },
    b: {
      type: SettingItemType.String,
      public: false,
      value: "1",
      isEnum: true,
      options: {
        "1": "b.options.1",
        "2": "b.options.2",
      },
      label: "b.label",
      description: "b.description",
    },
  },
} as const satisfies ExtendedSettingSection<FooSettings>
