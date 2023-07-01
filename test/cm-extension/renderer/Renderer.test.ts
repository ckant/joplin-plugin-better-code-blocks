import { mock, when } from "strong-mock"
import { describe, it } from "vitest"

import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { Origin } from "@cm-extension/model/Origin"
import { Renderer } from "@cm-extension/renderer/Renderer"
import { RenderParser } from "@cm-extension/renderer/RenderParser"
import { RenderPerformer } from "@cm-extension/renderer/RenderPerformer"

import { Any } from "test-support/fixtures/Any"
import { DocData } from "test-support/fixtures/DocData"

describe("Renderer", () => {
  describe("render", () => {
    it("renders", () => {
      const { doc, codeBlock } = DocData.Any.simple()
      const mockRenderPerformer = mock<RenderPerformer>()
      const mockRenderedCodeBlocks = mock<CodeBlock[]>()
      when(() => mockRenderPerformer.perform(doc, [codeBlock], Origin.RenderHandler)).thenReturn(
        mockRenderedCodeBlocks,
      )

      Renderer.create({
        renderParser: RenderParser.create({
          config: Any.configWith({ excludedLanguages: [] }),
          parser: Any.parser(),
        }),
        renderPerformer: mockRenderPerformer,
      }).render(doc, Origin.RenderHandler)
    })

    it("skips render when code blocks are unchanged", () => {
      const { doc, codeBlock } = DocData.Any.simple()
      const mockRenderPerformer = mock<RenderPerformer>()
      when(() => mockRenderPerformer.perform(doc, [codeBlock], Origin.RenderHandler)).thenReturn([
        codeBlock,
      ])

      const renderer = Renderer.create({
        renderParser: RenderParser.create({
          config: Any.configWith({ excludedLanguages: [] }),
          parser: Any.parser(),
        }),
        renderPerformer: mockRenderPerformer,
      })

      renderer.render(doc, Origin.RenderHandler)
      renderer.render(doc, Origin.RenderHandler)
    })
  })
})
