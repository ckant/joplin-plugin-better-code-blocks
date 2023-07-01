import { Doc, LineHandle } from "codemirror"
import { mock, when } from "strong-mock"
import { beforeEach, describe, it } from "vitest"

import { LineStyle } from "@cm-extension/marker/line-styler/LineStyle"
import { LineStyleGenerator } from "@cm-extension/marker/line-styler/LineStyleGenerator"
import { LineStyler } from "@cm-extension/marker/line-styler/LineStyler"
import { CodeBlock } from "@cm-extension/model/CodeBlock"

describe("LineStyler", () => {
  describe("mark", () => {
    const mockDoc = mock<Doc>()
    const mockCodeBlocks = mock<readonly CodeBlock[]>()
    const mockLineStyleGenerator = mock<LineStyleGenerator>()
    const mockLineHandle = mock<LineHandle>()

    const lineStyles: readonly LineStyle[] = [{ line: 0, text: ["cb-code-line"] }]

    beforeEach(() => {
      when(() => mockLineStyleGenerator.generate(mockCodeBlocks)).thenReturn(lineStyles)
      when(() => mockDoc.addLineClass(0, "text", "cb-code-line")).thenReturn(mockLineHandle)
    })

    it("adds line styles", () => {
      LineStyler.create({
        lineStyleGenerator: mockLineStyleGenerator,
      }).mark(mockDoc, mockCodeBlocks)
    })

    it("removes old line styles", () => {
      when(() => mockLineStyleGenerator.generate([])).thenReturn([])
      when(() => mockDoc.removeLineClass(mockLineHandle, "text", "cb-code-line")).thenReturn(
        mockLineHandle,
      )

      const lineStyler = LineStyler.create({
        lineStyleGenerator: mockLineStyleGenerator,
      })

      lineStyler.mark(mockDoc, mockCodeBlocks)
      lineStyler.mark(mockDoc, [])
    })
  })
})
