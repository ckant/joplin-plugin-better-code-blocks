import { describe, expect, it } from "vitest"

import { Config } from "@cm-extension/cm6/model/Config"
import { ConfigEditorAttributes } from "@cm-extension/cm6/rendering/ConfigEditorAttributes"

import { Any } from "test-support/fixtures/cm6/Any"

describe("ConfigEditorAttributes", () => {
  it("returns config editor attributes", () => {
    const config: Config = {
      completedLanguages: ["french"],
      completion: "disabled",
      copyFormat: "fencedCode",
      cornerStyle: "round",
      excludedLanguages: ["english"],
      renderLayout: "standard",
      rendering: "disabled",
      selectAllCapturing: "disabled",
    }

    expect(ConfigEditorAttributes(Any.stateWith({ config }))).toStrictEqual({
      "data-cb-corner-style": "round",
      "data-cb-rendering": "disabled",
      "data-cb-render-layout": "standard",
    })
  })
})
