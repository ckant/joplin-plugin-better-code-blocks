import { EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { Config } from "@cm-extension/cm6/model/Config"
import { ConfigFacet, ConfigFacetSpec } from "@cm-extension/cm6/state/ConfigFacet"

describe("ConfigFacetSpec", () => {
  describe("combine", () => {
    it("returns default config", () => {
      expect(ConfigFacetSpec.defaultValue()).toStrictEqual(Config.createDefault())
    })
  })
})

describe("ConfigFacet", () => {
  it("returns default config when no config present", () => {
    expect(EditorState.create().facet(ConfigFacet)).toStrictEqual(Config.createDefault())
  })

  it("returns config", () => {
    const config = Config.createDefault()
    expect(EditorState.create({ extensions: ConfigFacet.of(config) }).facet(ConfigFacet)).toBe(
      config,
    )
  })
})
