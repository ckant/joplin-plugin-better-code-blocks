import { mock, when } from "strong-mock"
import { Arrays } from "@ts-belt"
import { describe, expect, it } from "vitest"

import { Formatter } from "@cm-extension/formatter/Formatter"
import { Marker } from "@cm-extension/marker/Marker"
import { Origin } from "@cm-extension/model/Origin"
import { RenderPerformer } from "@cm-extension/renderer/RenderPerformer"

import { DocData } from "test-support/fixtures/DocData"

describe("RenderPerformer", () => {
  describe("perform", () => {
    it("performs rendering", () => {
      const { doc, codeBlocks } = DocData.Any.combo()
      doc.setCursor({ line: 6, ch: 2 })
      const formattedCodeBlocks = [Arrays.head(codeBlocks)!]
      const mockFormatter = mock<Formatter>()
      const mockMarker = mock<Marker>()

      when(() => mockFormatter.format(doc, codeBlocks, Origin.RenderHandler)).thenReturn(
        formattedCodeBlocks,
      )

      when(() => mockMarker.mark(doc, formattedCodeBlocks)).thenReturn()

      const renderPerformer = RenderPerformer.create({
        formatter: mockFormatter,
        marker: mockMarker,
      })

      expect(renderPerformer.perform(doc, codeBlocks, Origin.RenderHandler)).toBe(
        formattedCodeBlocks,
      )
      expect(doc.getCursor()).toEqual({ line: 5, ch: 1 })
    })
  })
})
