import { describe, expect, it } from "vitest"

import { Origin } from "@cm-extension/cm5/model/Origin"

import { Any } from "test-support/fixtures/cm5/Any"
import { DocData } from "test-support/fixtures/cm5/DocData"

describe("BetweenSpacer", () => {
  describe("format", () => {
    it("adds newlines between adjacent code blocks", () => {
      const { doc, codeBlocks } = DocData.Unspaced.combo()
      const { doc: spacedDoc, codeBlocks: spacedCodeBlocks } = DocData.Spaced.combo()

      const newCodeBlocks = Any.betweenSpacer().format(doc, codeBlocks, Origin.RenderHandler)

      expect(newCodeBlocks).toStrictEqual(spacedCodeBlocks)
      expect(doc.getValue()).toStrictEqual(spacedDoc.getValue())
    })

    it.each(comboDocCursors)(
      "preserves cursor when spacing adjacent code blocks and cursor is $cursor",
      ({ before, after }) => {
        const { doc, codeBlocks } = DocData.Unspaced.combo()
        doc.setCursor(before)

        Any.betweenSpacer().format(doc, codeBlocks, Origin.RenderHandler)

        expect(doc.getCursor()).toMatchObject(after)
      },
    )

    it("uses the proper origin when adding newlines", () => {
      const { doc, codeBlocks } = DocData.Unspaced.combo()

      const origins = new Set<string | undefined>()
      doc.on("beforeChange", (_doc, change) => {
        origins.add(change.origin)
      })
      Any.betweenSpacer().format(doc, codeBlocks, Origin.RenderHandler)

      expect(origins).toContainExactlyItem(Origin.RenderHandler)
    })
  })
})

const comboDocCursors = [
  {
    cursor: "at start of first unspaced code block",
    before: { line: 1, ch: 4 },
    after: { line: 1, ch: 4 },
  },
  {
    cursor: "at end of first unspaced code block",
    before: { line: 5, ch: 2 },
    after: { line: 5, ch: 2 },
  },
  {
    cursor: "at start of first spaced code block",
    before: { line: 6, ch: 4 },
    after: { line: 7, ch: 4 },
  },
  {
    cursor: "at end of first spaced code block",
    before: { line: 10, ch: 2 },
    after: { line: 11, ch: 2 },
  },
  {
    cursor: "between code blocks",
    before: { line: 16, ch: 0 },
    after: { line: 18, ch: 0 },
  },
  {
    cursor: "at start of last unspaced code block",
    before: { line: 23, ch: 8 },
    after: { line: 25, ch: 8 },
  },
  {
    cursor: "at end of last unspaced code block",
    before: { line: 27, ch: 1 },
    after: { line: 29, ch: 1 },
  },
]
