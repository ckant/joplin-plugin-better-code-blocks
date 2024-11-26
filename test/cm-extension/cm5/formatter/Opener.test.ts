import { describe, expect, it } from "vitest"

import { Origin } from "@cm-extension/cm5/model/Origin"

import { Any } from "test-support/fixtures/cm5/Any"
import { DocData } from "test-support/fixtures/cm5/DocData"

describe("Opener", () => {
  describe("format", () => {
    it("opens code blocks", () => {
      const { doc, codeBlocks } = DocData.Unopened.combo()
      const { doc: openedDoc, codeBlocks: openedCodeBlocks } = DocData.Opened.combo()

      const newCodeBlocks = Any.opener().format(doc, codeBlocks, Origin.RenderHandler)

      expect(newCodeBlocks).toStrictEqual(openedCodeBlocks)
      expect(doc.getValue()).toStrictEqual(openedDoc.getValue())
    })

    it.each(cursors)("preserves cursor when cursor is $location", ({ before, after }) => {
      const { doc, codeBlocks } = DocData.Unopened.combo()
      doc.setCursor(before)

      Any.opener().format(doc, codeBlocks, Origin.RenderHandler)

      expect(doc.getCursor()).toMatchObject(after)
    })

    it("uses the proper origin when opening code blocks", () => {
      const { doc, codeBlocks } = DocData.Unopened.combo()

      const origins = new Set<string | undefined>()
      doc.on("beforeChange", (_doc, change) => {
        origins.add(change.origin)
      })
      Any.opener().format(doc, codeBlocks, Origin.RenderHandler)

      expect(origins).toContainExactlyItem(Origin.RenderHandler)
    })
  })
})

const cursors = [
  {
    location: "before all code blocks",
    before: { line: 0, ch: 0 },
    after: { line: 0, ch: 0 },
  },
  {
    location: "at start of first changed code block",
    before: { line: 1, ch: 4 },
    after: { line: 1, ch: 4 },
  },
  {
    location: "at end of first changed code block",
    before: { line: 2, ch: 2 },
    after: { line: 3, ch: 2 },
  },
  {
    location: "between code blocks",
    before: { line: 3, ch: 0 },
    after: { line: 4, ch: 0 },
  },
  {
    location: "start of unchaged code block",
    before: { line: 13, ch: 8 },
    after: { line: 15, ch: 8 },
  },
  {
    location: "inside unchanged code block",
    before: { line: 5, ch: 5 },
    after: { line: 6, ch: 5 },
  },
  {
    location: "at end of unchaged code block",
    before: { line: 17, ch: 1 },
    after: { line: 19, ch: 1 },
  },
  {
    location: "at start of last changed code block",
    before: { line: 19, ch: 3 },
    after: { line: 21, ch: 3 },
  },
  {
    location: "at end of last changed code block",
    before: { line: 20, ch: 1 },
    after: { line: 23, ch: 1 },
  },
  {
    location: "after all code blocks",
    before: { line: 21, ch: 0 },
    after: { line: 24, ch: 0 },
  },
]
