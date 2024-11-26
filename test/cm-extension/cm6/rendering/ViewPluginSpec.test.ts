import { RangeSet } from "@codemirror/state"
import { Decoration } from "@codemirror/view"
import { describe, expect, it } from "vitest"

import { ViewPluginSpec } from "@cm-extension/cm6/rendering/ViewPluginSpec"

describe("ViewPluginSpec", () => {
  describe("decorations", () => {
    it("returns plugin decorations", () => {
      const decorations = RangeSet.of(Decoration.line({}).range(0))

      expect(ViewPluginSpec.decorations!({ decorations })).toStrictEqual(decorations)
    })
  })
})
