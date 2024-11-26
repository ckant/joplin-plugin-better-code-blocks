import { Doc } from "codemirror"
import { Functions } from "@ts-belt"
import { describe, expect, it } from "vitest"

import { LineSegment } from "@ext/codemirror/cm5/LineSegment"

import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { EachLine } from "@cm-extension/cm5/Parser"

import { Any } from "test-support/fixtures/cm5/Any"
import { DocData } from "test-support/fixtures/cm5/DocData"

describe("Parser", () => {
  describe("parse", () => {
    it("parses code blocks", () => {
      const { doc } = DocData.Mixed.combo()

      const codeBlocks = Any.parser().parse(doc)
      expect(codeBlocks).toStrictEqual(mixedMultiComboBlocks)
    })

    it.each([DocData.Invalid.unclosed().doc, DocData.Invalid.nested().doc])(
      "returns no code blocks when code blocks are invalid",
      (doc) => {
        const codeBlocks = Any.parser().parse(doc)
        expect(codeBlocks).toBeEmpty()
      },
    )

    it.each([DocData.None.empty().doc, DocData.None.nonempty().doc])(
      "returns no code blocks when there are no code blocks",
      (doc) => {
        const codeBlocks = Any.parser().parse(doc)
        expect(codeBlocks).toBeEmpty()
      },
    )
  })

  describe("parseBy", () => {
    it("parses code blocks with eachLine", () => {
      const doc = new Doc("")
      const endIteration = Functions.ignore
      const eachLine: EachLine = (_doc, fn) => {
        ;[
          { line: 0, text: "```typescript", endIteration },
          { line: 1, text: "console.info('Hello World')", endIteration },
          { line: 2, text: "```", endIteration },
        ].forEach(fn)
      }

      expect(Any.parser().parseBy(doc, eachLine)).toStrictEqual([
        CodeBlock.of({
          start: LineSegment.of({ line: 0, from: 0, to: 13 }),
          end: LineSegment.of({ line: 2, from: 0, to: 3 }),
          lang: "typescript",
          openingFence: "```typescript",
          closingFence: "```",
        }),
      ])
    })
  })
})

const mixedMultiComboBlocks = [
  CodeBlock.of({
    start: LineSegment.of({
      line: 0,
      from: 0,
      to: " ```kotlin   // Some other stuff".length,
    }),
    end: LineSegment.of({
      line: 1,
      from: 0,
      to: " ```".length,
    }),
    lang: "kotlin",
    openingFence: " ```kotlin   // Some other stuff",
    closingFence: " ```",
  }),
  CodeBlock.of({
    start: LineSegment.of({
      line: 2,
      from: 0,
      to: "  ~~~~~~".length,
    }),
    end: LineSegment.of({
      line: 4,
      from: 0,
      to: "  ~~~~~~".length,
    }),
    lang: undefined,
    openingFence: "  ~~~~~~",
    closingFence: "  ~~~~~~",
  }),
  CodeBlock.of({
    start: LineSegment.of({
      line: 6,
      from: 0,
      to: "```typescript".length,
    }),
    end: LineSegment.of({
      line: 10,
      from: 0,
      to: "```".length,
    }),
    lang: "typescript",
    openingFence: "```typescript",
    closingFence: "```",
  }),
  CodeBlock.of({
    start: LineSegment.of({
      from: 0,
      line: 12,
      to: "`````".length,
    }),
    end: LineSegment.of({
      line: 13,
      from: 0,
      to: "`````".length,
    }),
    lang: undefined,
    openingFence: "`````",
    closingFence: "`````",
  }),
  CodeBlock.of({
    start: LineSegment.of({
      line: 15,
      from: 0,
      to: "````java  ".length,
    }),
    end: LineSegment.of({
      line: 19,
      from: 0,
      to: "````    ".length,
    }),
    lang: "java",
    openingFence: "````java  ",
    closingFence: "````    ",
  }),
  CodeBlock.of({
    start: LineSegment.of({
      line: 21,
      from: 0,
      to: "   ```".length,
    }),
    end: LineSegment.of({
      line: 23,
      from: 0,
      to: "   ```".length,
    }),
    lang: undefined,
    openingFence: "   ```",
    closingFence: "   ```",
  }),
]
