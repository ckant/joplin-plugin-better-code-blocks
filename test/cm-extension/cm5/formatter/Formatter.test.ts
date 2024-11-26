import { Doc } from "codemirror"
import { mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { Formatter } from "@cm-extension/cm5/formatter/Formatter"
import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { Origin } from "@cm-extension/cm5/model/Origin"

describe("Formatter", () => {
  describe("combine", () => {
    it("combines formatters", () => {
      const mockDoc = mock<Doc>()
      const mockFormatterOne = mock<Formatter>()
      const mockFormatterTwo = mock<Formatter>()
      const mockCodeBlocks = mock<CodeBlock[]>()
      const mockCodeBlocksFromOne = mock<CodeBlock[]>()
      const mockCodeBlocksFromTwo = mock<CodeBlock[]>()

      when(() => mockFormatterOne.format(mockDoc, mockCodeBlocks, Origin.RenderHandler)).thenReturn(
        mockCodeBlocksFromOne,
      )

      when(() =>
        mockFormatterTwo.format(mockDoc, mockCodeBlocksFromOne, Origin.RenderHandler),
      ).thenReturn(mockCodeBlocksFromTwo)

      const newCodeBlocks = Formatter.combine(mockFormatterOne, mockFormatterTwo).format(
        mockDoc,
        mockCodeBlocks,
        Origin.RenderHandler,
      )

      expect(newCodeBlocks).toBe(mockCodeBlocksFromTwo)
    })
  })
})
