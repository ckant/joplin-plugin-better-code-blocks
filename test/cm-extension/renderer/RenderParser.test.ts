import { describe, expect, it } from "vitest"

import { RenderParser } from "@cm-extension/renderer/RenderParser"

import { Any } from "test-support/fixtures/Any"
import { DocData } from "test-support/fixtures/DocData"

describe("RenderParser", () => {
  describe("parse", () => {
    it("parses code blocks with exclusions", () => {
      const { doc, codeBlocks } = DocData.Mixed.combo()
      expect(
        RenderParser.create({
          config: Any.configWith({ excludedLanguages: ["java", "kotlin"] }),
          parser: Any.parser(),
        }).parse(doc),
      ).toStrictEqual(codeBlocks.filter((cb) => cb.lang !== "java" && cb.lang !== "kotlin"))
    })
  })
})
