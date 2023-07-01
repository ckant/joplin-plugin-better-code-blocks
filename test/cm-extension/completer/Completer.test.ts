import { Doc } from "codemirror"
import { It, mock, when } from "strong-mock"
import { describe, expect, it } from "vitest"

import { Completer } from "@cm-extension/completer/Completer"
import { CompletionGenerator } from "@cm-extension/completer/CompletionGenerator"
import { Origin } from "@cm-extension/model/Origin"

import { InlineDoc } from "test-support/ext/codemirror/InlineDoc"
import { Any } from "test-support/fixtures/Any"

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
      when(() => mockCompletionGenerator.generate(It.isObject())).thenReturn("completion")
      when(() => mockDoc.getCursor()).thenReturn({ line: 0, ch: 0 })
      when(() => mockDoc.lineSeparator()).thenReturn("lineSeparator")
      when(() =>
        mockDoc.replaceRange(It.isString(), It.isObject(), undefined, Origin.CompleteHandler),
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
