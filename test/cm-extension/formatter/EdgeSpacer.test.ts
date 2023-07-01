import { describe, expect, it } from "vitest"

import { Origin } from "@cm-extension/model/Origin"

import { Any } from "test-support/fixtures/Any"
import { DocData } from "test-support/fixtures/DocData"

describe("EdgeSpacer", () => {
  describe("format", () => {
    it("adds newline at start and/or end of doc if doc starts and/or ends with code block", () => {
      const { doc, codeBlock } = DocData.Unspaced.simple()
      const { doc: spacedDoc, codeBlock: spacedCodeBlock } = DocData.Spaced.simple()

      const newCodeBlocks = Any.edgeSpacer().format(doc, [codeBlock], Origin.RenderHandler)

      expect(newCodeBlocks).toStrictEqual([spacedCodeBlock])
      expect(doc.getValue()).toStrictEqual(spacedDoc.getValue())
    })

    it.each(simpleDocCursors)(
      "preserves cursor when adding newline at start and/or end and cursor is $cursor",
      ({ before, after }) => {
        const { doc, codeBlock } = DocData.Unspaced.simple()
        doc.setCursor(before)

        Any.edgeSpacer().format(doc, [codeBlock], Origin.RenderHandler)

        expect(doc.getCursor()).toMatchObject(after)
      },
    )

    it("uses the proper origin when adding newlines", () => {
      const { doc, codeBlock } = DocData.Unspaced.simple()

      const origins = new Set<string | undefined>()
      doc.on("beforeChange", (_doc, change) => {
        origins.add(change.origin)
      })
      Any.edgeSpacer().format(doc, [codeBlock], Origin.RenderHandler)

      expect(origins).toContainExactlyItem(Origin.RenderHandler)
    })
  })
})

const simpleDocCursors = [
  {
    cursor: "at start of code block",
    before: { line: 0, ch: 4 },
    after: { line: 1, ch: 4 },
  },
  {
    cursor: "inside code block",
    before: { line: 2, ch: 10 },
    after: { line: 3, ch: 10 },
  },
  {
    cursor: "at end of code block",
    before: { line: 4, ch: 3 },
    after: { line: 5, ch: 3 },
  },
]
