import { describe, expect, it } from "vitest"

import { InlineDoc } from "test-support/ext/codemirror/InlineDoc"
import { Any } from "test-support/fixtures/Any"

describe("CompletionGenerator", () => {
  describe("generate", () => {
    it.each(noCompletions)("generates no completion when $reason", ({ doc }) => {
      expect(Any.completionGenerator().generate(doc)).toBeUndefined()
    })

    it("generates completion", () => {
      const doc = InlineDoc`~~~^`

      expect(Any.completionGenerator().generate(doc)).toBe("~~~")
    })
  })
})

const noCompletions = [
  {
    reason: "cursor not at end of line",
    doc: InlineDoc`
      ~~^~
      ~~~
    `,
  },
  {
    reason: "line isn't start sequence",
    doc: InlineDoc`~~^`,
  },
  {
    reason: "codeblocks are already parseable",
    doc: InlineDoc`
      ~~~^
      ~~~
    `,
  },
  {
    reason: "completion wouldn't end current code block",
    doc: InlineDoc`
      ~~~
      ~~~^
      ~~~
    `,
  },
  {
    reason: "completion wouldn't make all codeblocks parseable",
    doc: InlineDoc`
      ~~~^
      ~~~
      ~~~typescript
    `,
  },
]
