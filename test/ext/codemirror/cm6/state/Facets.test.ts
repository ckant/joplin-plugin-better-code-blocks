import { EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { Facets } from "@ext/codemirror/cm6/state/Facets"

describe("Facets", () => {
  describe("defineSingular", () => {
    it("returns default value when no value present", () => {
      const facet = Facets.defineSingular({ defaultValue: () => "defaultValue" })

      expect(EditorState.create().facet(facet)).toBe("defaultValue")
    })

    it("returns first value when multiple values present", () => {
      const facet = Facets.defineSingular({ defaultValue: () => "defaultValue" })

      expect(
        EditorState.create({ extensions: [facet.of("first"), facet.of("second")] }).facet(facet),
      ).toBe("first")
    })
  })
})
