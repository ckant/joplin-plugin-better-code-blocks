import { EditorSelectionChange, Range } from "codemirror"
import { mock, when } from "strong-mock"
import { describe, it } from "vitest"

import { InlineDoc } from "test-support/ext/codemirror/cm5/InlineDoc"
import { Any } from "test-support/fixtures/cm5/Any"

describe("SelectHandler", () => {
  describe("selectOnSelectAll", () => {
    it("updates to select surrounding code on select all", () => {
      const doc = InlineDoc`
        ~~~
        code
        ~~~
      `

      const mockUpdate = mock<EditorSelectionChange["update"]>()
      when(() =>
        mockUpdate([{ anchor: { line: 1, ch: 0 }, head: { line: 1, ch: 4 } }]),
      ).thenReturn()

      Any.selectHandler().selectOnSelectAll(doc, {
        ranges: [{ anchor: { line: 0, ch: 0 }, head: { line: 2, ch: 3 } }] as Range[],
        update: mockUpdate,
      })
    })

    it("doesn't update when not select all", () => {
      const doc = InlineDoc`
        ~~~
        code
        ~~~
      `

      Any.selectHandler().selectOnSelectAll(doc, {
        ranges: [{ anchor: { line: 0, ch: 0 }, head: { line: 2, ch: 2 } }] as Range[],
        update: () => undefined,
      })
    })

    it("doesn't update when no surrounding code", () => {
      const doc = InlineDoc`
        # Heading^
        ~~~
        code
        ~~~
      `

      Any.selectHandler().selectOnSelectAll(doc, {
        ranges: [{ anchor: { line: 0, ch: 0 }, head: { line: 3, ch: 3 } }] as Range[],
        update: mock<EditorSelectionChange["update"]>(),
      })
    })

    it("doesn't update when surrounding code already selected", () => {
      const doc = InlineDoc`
        ~~~
        code^
        ~~~
      `
      doc.setSelection({ line: 1, ch: 0 }, { line: 1, ch: 4 })

      Any.selectHandler().selectOnSelectAll(doc, {
        ranges: [{ anchor: { line: 0, ch: 0 }, head: { line: 2, ch: 3 } }] as Range[],
        update: mock<EditorSelectionChange["update"]>(),
      })
    })
  })
})
