import { Doc, MarkerRange, TextMarker } from "codemirror"
import { mock, when } from "strong-mock"
import { beforeEach, describe, it } from "vitest"

import { LineSegment } from "@ext/codemirror/cm5/LineSegment"

import { Widget } from "@cm-extension/cm5/marker/widgeter/Widget"
import { Widgeter } from "@cm-extension/cm5/marker/widgeter/Widgeter"
import { WidgetGenerator } from "@cm-extension/cm5/marker/widgeter/WidgetGenerator"
import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"

describe("Widgeter", () => {
  describe("mark", () => {
    const mockDoc = mock<Doc>()
    const mockCodeBlocks = mock<readonly CodeBlock[]>()
    const mockWidgetGenerator = mock<WidgetGenerator>()
    const mockTextMarker = mock<TextMarker<MarkerRange>>()

    const element = document.createElement("div")
    const widgets: readonly Widget[] = [
      { range: LineSegment.of({ line: 0, from: 1, to: 2 }), element: element },
    ]

    beforeEach(() => {
      when(() => mockWidgetGenerator.generate(mockDoc, mockCodeBlocks)).thenReturn(widgets)
      when(() =>
        mockDoc.markText(
          { line: 0, ch: 1 },
          { line: 0, ch: 2 },
          {
            atomic: true,
            collapsed: true,
            inclusiveLeft: false,
            inclusiveRight: false,
            replacedWith: element,
            selectLeft: false,
            selectRight: false,
          },
        ),
      ).thenReturn(mockTextMarker)
    })

    it("adds widgets", () => {
      Widgeter.create({
        widgetGenerator: mockWidgetGenerator,
      }).mark(mockDoc, mockCodeBlocks)
    })

    it("removes old widgets", () => {
      const newCodeBlocks: readonly CodeBlock[] = []
      when(() => mockWidgetGenerator.generate(mockDoc, newCodeBlocks)).thenReturn([])
      when(() => mockTextMarker.clear()).thenReturn()
      const widgeter = Widgeter.create({
        widgetGenerator: mockWidgetGenerator,
      })

      widgeter.mark(mockDoc, mockCodeBlocks)
      widgeter.mark(mockDoc, newCodeBlocks)
    })
  })
})
