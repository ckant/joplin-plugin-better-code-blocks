import { Doc } from "codemirror"
import { mock, when } from "strong-mock"
import { describe, it } from "vitest"

import { Marker } from "@cm-extension/marker/Marker"
import { CodeBlock } from "@cm-extension/model/CodeBlock"

describe("Marker", () => {
  describe("combine", () => {
    it("combines markers", () => {
      const mockDoc = mock<Doc>()
      const mockCodeBlocks = mock<CodeBlock[]>()
      const mockMarkerOne = mock<Marker>()
      const mockMarkerTwo = mock<Marker>()

      when(() => mockMarkerOne.mark(mockDoc, mockCodeBlocks)).thenReturn()
      when(() => mockMarkerTwo.mark(mockDoc, mockCodeBlocks)).thenReturn()

      Marker.combine(mockMarkerOne, mockMarkerTwo).mark(mockDoc, mockCodeBlocks)
    })
  })
})
