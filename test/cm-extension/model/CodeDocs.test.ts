import { describe, expect, it } from "vitest"

import { Range } from "@ext/codemirror/Range"

import { CodeDocs } from "@cm-extension/model/CodeDocs"
import { Origin } from "@cm-extension/model/Origin"

import { DocData } from "test-support/fixtures/DocData"

describe("CodeDocs", () => {
  describe("getCode", () => {
    it("gets code", () => {
      const { doc, codeBlock, text } = DocData.Any.simple()

      expect(CodeDocs.getCode(doc, codeBlock)).toBe(text.split("\n").slice(1, 4).join("\n"))
    })

    it("gets code excluding fences", () => {
      const { doc, codeBlock, text } = DocData.Any.simple()

      expect(CodeDocs.getCode(doc, codeBlock, { includeFences: false })).toBe(
        text.split("\n").slice(1, 4).join("\n"),
      )
    })

    it("gets code including fences", () => {
      const { doc, codeBlock, text } = DocData.Any.simple()

      expect(CodeDocs.getCode(doc, codeBlock, { includeFences: true })).toBe(text)
    })
  })

  describe("getCodeRange", () => {
    it("gets code range", () => {
      const { doc, codeBlock } = DocData.Any.simple()

      expect(CodeDocs.getCodeRange(doc, codeBlock)).toStrictEqual(
        Range.of({
          from: { line: 1, ch: 0 },
          to: { line: 3, ch: 1 },
        }),
      )
    })
  })

  describe("getActiveCodeBlock", () => {
    it("gets code block when at start", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 1, ch: 1 })

      const activeCodeBlock = CodeDocs.getActiveCodeBlock(doc, [codeBlock])

      expect(activeCodeBlock).toBe(activeCodeBlock)
    })

    it("gets code block when inside", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 2, ch: 5 })

      const activeCodeBlock = CodeDocs.getActiveCodeBlock(doc, [codeBlock])

      expect(activeCodeBlock).toBe(activeCodeBlock)
    })

    it("gets code block when at end", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 5, ch: 2 })

      const activeCodeBlock = CodeDocs.getActiveCodeBlock(doc, [codeBlock])

      expect(activeCodeBlock).toBe(activeCodeBlock)
    })

    it("gets nothing when not within code block", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 0, ch: 0 })

      const activeCodeBlock = CodeDocs.getActiveCodeBlock(doc, [codeBlock])

      expect(activeCodeBlock).toBeUndefined()
    })
  })

  describe("clampCursorOfActiveCodeBlockToCode", () => {
    it("leaves cursor alone when before code block ", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 0, ch: 0 })

      CodeDocs.clampCursorOfActiveCodeBlockToCode(doc, [codeBlock], Origin.RenderHandler)

      expect(doc.getCursor()).toMatchObject({ line: 0, ch: 0 })
    })

    it("moves cursor into active code block when at start", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 1, ch: 1 })

      CodeDocs.clampCursorOfActiveCodeBlockToCode(doc, [codeBlock], Origin.RenderHandler)

      expect(doc.getCursor()).toMatchObject({ line: 2, ch: 0 })
    })

    it("leaves cursor alone when already inside code block", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 2, ch: 5 })

      CodeDocs.clampCursorOfActiveCodeBlockToCode(doc, [codeBlock], Origin.RenderHandler)

      expect(doc.getCursor()).toMatchObject({ line: 2, ch: 5 })
    })

    it("moves cursor into surrounding code block when at end", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 5, ch: 2 })

      CodeDocs.clampCursorOfActiveCodeBlockToCode(doc, [codeBlock], Origin.RenderHandler)

      expect(doc.getCursor()).toMatchObject({ line: 4, ch: 1 })
    })

    it("leaves cursor alone when after code block", () => {
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 6, ch: 0 })

      CodeDocs.clampCursorOfActiveCodeBlockToCode(doc, [codeBlock], Origin.RenderHandler)

      expect(doc.getCursor()).toMatchObject({ line: 6, ch: 0 })
    })

    it("sets proper origin during clamp", () => {
      const origins = new Set<string | undefined>()
      const { doc, codeBlock } = DocData.Spaced.simple()
      doc.setCursor({ line: 1, ch: 1 })
      doc.on("beforeSelectionChange", (_doc, change) => {
        origins.add(change.origin)
      })

      CodeDocs.clampCursorOfActiveCodeBlockToCode(doc, [codeBlock], Origin.RenderHandler)

      expect(origins).toContainExactlyItem(Origin.RenderHandler)
    })
  })
})
