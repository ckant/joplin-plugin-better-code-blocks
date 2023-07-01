import { describe, expect, it } from "vitest"

import { LineStyle } from "@cm-extension/marker/line-styler/LineStyle"

import { Any } from "test-support/fixtures/Any"
import { DocData } from "test-support/fixtures/DocData"

describe("LineStyleGenerator", () => {
  describe("generate", () => {
    it("generates line styles", () => {
      const { codeBlocks } = DocData.Any.combo()

      const lineStyles = Any.lineStyleGenerator().generate(codeBlocks)

      expect(lineStyles).toStrictEqual(comboLineStyles)
    })
  })
})

const comboLineStyles: readonly LineStyle[] = [
  {
    line: 2,
    background: ["cb-start-background"],
    text: ["cb-start-text"],
    wrap: ["cb-start-line"],
  },
  {
    line: 3,
    background: ["cb-code-background", "cb-first"],
    text: ["cb-code-text", "cb-first"],
    wrap: ["cb-code-line", "cb-first"],
  },
  {
    line: 4,
    background: ["cb-code-background"],
    text: ["cb-code-text"],
    wrap: ["cb-code-line"],
  },
  {
    line: 5,
    background: ["cb-code-background", "cb-last"],
    text: ["cb-code-text", "cb-last"],
    wrap: ["cb-code-line", "cb-last"],
  },
  {
    line: 6,
    background: ["cb-end-background"],
    text: ["cb-end-text"],
    wrap: ["cb-end-line"],
  },
  {
    line: 10,
    background: ["cb-start-background"],
    text: ["cb-start-text"],
    wrap: ["cb-start-line"],
  },
  {
    line: 11,
    background: ["cb-end-background"],
    text: ["cb-end-text"],
    wrap: ["cb-end-line"],
  },
  {
    line: 15,
    background: ["cb-start-background"],
    text: ["cb-start-text"],
    wrap: ["cb-start-line"],
  },
  {
    line: 16,
    background: ["cb-code-background", "cb-first", "cb-last"],
    text: ["cb-code-text", "cb-first", "cb-last"],
    wrap: ["cb-code-line", "cb-first", "cb-last"],
  },
  {
    line: 17,
    background: ["cb-end-background"],
    text: ["cb-end-text"],
    wrap: ["cb-end-line"],
  },
]
