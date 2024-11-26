import { describe, expect, it } from "vitest"

import { InlineDoc } from "test-support/ext/codemirror/cm5/InlineDoc"
import { Any } from "test-support/fixtures/cm5/Any"

describe("RangeFinder", () => {
  describe("findActiveCodeRange", () => {
    it("finds active code range", () => {
      const doc = InlineDoc`
        ~~~typescrip^t
        true
        ~~~
      `

      expect(Any.rangeFinder().findActiveCodeRange(doc)).toEqual({
        from: { line: 1, ch: 0 },
        to: { line: 1, ch: 4 },
      })
    })

    it("finds nothing when no active code", () => {
      const doc = InlineDoc`
        # Heading ^
        ~~~typescript
        true
        ~~~
      `
      expect(Any.rangeFinder().findActiveCodeRange(doc)).toBeUndefined()
    })
  })
})
