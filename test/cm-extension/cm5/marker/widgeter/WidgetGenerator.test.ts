import { describe, expect, it } from "vitest"

import { LineSegment } from "@ext/codemirror/cm5/LineSegment"

import { WidgetGenerator } from "@cm-extension/cm5/marker/widgeter/WidgetGenerator"

import { CondensedString } from "test-support/ext/stdlib/CondensedString"
import { Any } from "test-support/fixtures/cm5/Any"
import { DocData } from "test-support/fixtures/cm5/DocData"

describe("WidgetGenerator", () => {
  describe("generate", () => {
    it("generates widgets", () => {
      const { doc, codeBlock } = DocData.Any.simple()

      const widgets = WidgetGenerator.create({
        copyButtonGenerator: Any.copyButtonGenerator(),
      }).generate(doc, [codeBlock])

      expect(widgets).toMatchObject(simpleWidgets)
    })
  })
})

const simpleWidgets = [
  {
    range: LineSegment.of({ line: 0, from: 0, to: 13 }),
    element: {
      outerHTML: CondensedString`
        <span class="cb-start-widget">
          <span class="cb-opening-fence cm-jn-monospace">\`\`\`typescript</span>
          <button class="cb-copy-btn" title="Copy Code">
            <i class="fa-solid fa-clipboard"></i>
          </button>
        </span>
      `,
    },
  },
  {
    range: LineSegment.of({ line: 4, from: 0, to: 3 }),
    element: {
      outerHTML: CondensedString`
        <span class="cb-end-widget">
          <span class="cb-closing-fence cm-jn-monospace">\`\`\`</span>
          <span class="cb-lang cm-jn-monospace">typescript</span>
        </span>
      `,
    },
  },
]
