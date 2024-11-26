import { Doc, Position, ReadonlyDoc } from "codemirror"
import { It, mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { Completer } from "@cm-extension/cm5/completer/Completer"
import { CompletionGenerator } from "@cm-extension/cm5/completer/CompletionGenerator"
import { Origin } from "@cm-extension/cm5/model/Origin"

import { InlineDoc } from "test-support/ext/codemirror/cm5/InlineDoc"
import { Any } from "test-support/fixtures/cm5/Any"

describe("Completer", () => {
  describe("complete", () => {
    it("completes", () => {
      const doc = InlineDoc`~~~^`
      const completedDoc = InlineDoc`
        ~~~
        ^
        ~~~
      `
      const didComplete = Any.completer().complete(doc, Origin.CompleteHandler)

      expect(didComplete).toBeTrue()
      expect(doc.getValue()).toBe(completedDoc.getValue())
      expect(doc.getCursor()).toMatchObject(completedDoc.getCursor())
    })

    it("sends origin", () => {
      const mockDoc = mock<Doc>()
      const mockCompletionGenerator = mock<CompletionGenerator>()
      when(() => mockCompletionGenerator.generate(It.isAny() as ReadonlyDoc)).thenReturn(
        "completion",
      )
      when(() => mockDoc.getCursor()).thenReturn({ line: 0, ch: 0 })
      when(() => mockDoc.lineSeparator()).thenReturn("lineSeparator")
      when(() =>
        mockDoc.replaceRange(
          It.isString(),
          It.isAny() as Position,
          undefined,
          Origin.CompleteHandler,
        ),
      ).thenReturn()
      when(() =>
        mockDoc.setCursor(It.isNumber(), undefined, { origin: Origin.CompleteHandler }),
      ).thenReturn()

      Completer.create({ completionGenerator: mockCompletionGenerator }).complete(
        mockDoc,
        Origin.CompleteHandler,
      )
    })

    it("doesn't complete if no completion", () => {
      const doc = InlineDoc`~~^`

      const didComplete = Any.completer().complete(doc, Origin.CompleteHandler)

      expect(didComplete).toBeFalse()
      expect(doc.getValue()).toBe(InlineDoc`~~^`.getValue())
      expect(doc.getCursor()).toMatchObject(InlineDoc`~~^`.getCursor())
    })
  })
})
