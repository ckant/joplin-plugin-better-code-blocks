import { Doc, LineHandle } from "codemirror"
import { mock, when } from "strong-mock"
import { Functions } from "@ts-belt"
import { describe, expect, it } from "vitest"

import { Docs } from "@ext/codemirror/Docs"
import { Range } from "@ext/codemirror/Range"

import { Origin } from "@cm-extension/model/Origin"

import { InlineDoc } from "test-support/ext/codemirror/InlineDoc"

describe("Docs", () => {
  describe("mapLines", () => {
    it("maps all lines", () => {
      const doc = new Doc("a\nb\nc")
      expect(Docs.mapLines(doc, ({ line, text }) => `${line} -> ${text}`)).toStrictEqual([
        "0 -> a",
        "1 -> b",
        "2 -> c",
      ])
    })
  })

  describe("eachLine", () => {
    it("iterates all lines", () => {
      const doc = new Doc("a\nb\nc")

      const lines: string[] = []
      Docs.eachLine(doc, ({ line, text }) => lines.push(`${line} -> ${text}`))

      expect(lines).toStrictEqual(["0 -> a", "1 -> b", "2 -> c"])
    })

    it("ends iteration when directed to", () => {
      const doc = new Doc("a\nb\nc")

      const lines: string[] = []
      Docs.eachLine(doc, ({ line, text, endIteration }) => {
        lines.push(`${line} -> ${text}`)
        if (line === 1) endIteration()
      })

      expect(lines).toStrictEqual(["0 -> a", "1 -> b"])
    })
  })

  describe("eachLineInserting", () => {
    it("iterates all lines and inserts at beginning", () => {
      const doc = new Doc("a\nb\nc")

      const lines: string[] = []
      Docs.eachLineInserting(doc, { line: 0, text: "inserted" }, ({ line, text }) =>
        lines.push(`${line} -> ${text}`),
      )

      expect(lines).toStrictEqual(["0 -> inserted", "1 -> a", "2 -> b", "3 -> c"])
    })

    it("iterates all lines and inserts in middle", () => {
      const doc = new Doc("a\nb\nc")

      const lines: string[] = []
      Docs.eachLineInserting(doc, { line: 1, text: "inserted" }, ({ line, text }) =>
        lines.push(`${line} -> ${text}`),
      )

      expect(lines).toStrictEqual(["0 -> a", "1 -> inserted", "2 -> b", "3 -> c"])
    })

    it("iterates all lines and inserts at end", () => {
      const doc = new Doc("a\nb\nc")

      const lines: string[] = []
      Docs.eachLineInserting(doc, { line: 3, text: "inserted" }, ({ line, text }) =>
        lines.push(`${line} -> ${text}`),
      )

      expect(lines).toStrictEqual(["0 -> a", "1 -> b", "2 -> c", "3 -> inserted"])
    })

    it("ends iteration when directed to", () => {
      const doc = new Doc("a\nb\nc")

      const lines: string[] = []
      Docs.eachLineInserting(doc, { line: 3, text: "inserted" }, ({ line, text, endIteration }) => {
        lines.push(`${line} -> ${text}`)
        if (line === 1) endIteration()
      })

      expect(lines).toStrictEqual(["0 -> a", "1 -> b"])
    })

    it("throws error when negative line", () => {
      const doc = new Doc("a\nb\nc")

      expect(() =>
        Docs.eachLineInserting(doc, { line: -1, text: "inserted" }, Functions.ignore),
      ).toThrowError()
    })
  })

  describe("insertNewLine", () => {
    it("inserts new line", () => {
      const doc = new Doc("foo\nbar")
      let origin: string | undefined = undefined
      doc.on("beforeChange", (_doc, change) => ({ origin } = change))

      Docs.insertNewLine(doc, { line: 0, ch: 1 }, "origin")

      expect(origin).toBe("origin")
      expect(doc.getValue()).toBe("f\noo\nbar")
    })

    it("throw error when negative pos.line", () => {
      const doc = new Doc("foo\nbar")

      expect(() => Docs.insertNewLine(doc, { line: -1, ch: 0 }, "origin")).toThrowError()
    })

    it("throw error when negative pos.ch", () => {
      const doc = new Doc("foo\nbar")

      expect(() => Docs.insertNewLine(doc, { line: 0, ch: -1 }, "origin")).toThrowError()
    })
  })

  describe("addLineClasses", () => {
    it("adds all line classes", () => {
      const mockDoc = mock<Doc>()
      const mockLineHandle = mock<LineHandle>()

      when(() => mockDoc.addLineClass(0, "background", "background")).thenReturn(mockLineHandle)
      when(() => mockDoc.addLineClass(0, "text", "text")).thenReturn(mockLineHandle)
      when(() => mockDoc.addLineClass(0, "wrap", "wrap")).thenReturn(mockLineHandle)
      when(() => mockDoc.addLineClass(0, "gutter", "gutter")).thenReturn(mockLineHandle)

      expect(
        Docs.addLineClasses(mockDoc, 0, {
          background: ["background"],
          text: ["text"],
          wrap: ["wrap"],
          gutter: ["gutter"],
        }),
      ).toBe(mockLineHandle)
    })

    it("works when no line classes are given", () => {
      const mockDoc = mock<Doc>()
      const mockLineHandle = mock<LineHandle>()
      when(() => mockDoc.getLineHandle(0)).thenReturn(mockLineHandle)

      expect(
        Docs.addLineClasses(mockDoc, 0, {
          background: [],
          text: [],
          wrap: [],
          gutter: [],
        }),
      ).toBe(mockLineHandle)
    })

    it("throw error when negative line number", () => {
      const mockDoc = mock<Doc>()

      expect(() => Docs.addLineClasses(mockDoc, -1, {})).toThrowError()
    })
  })

  describe("removeLineClasses", () => {
    it("removes all line classes", () => {
      const mockDoc = mock<Doc>()
      const mockLineHandle = mock<LineHandle>()

      when(() => mockDoc.removeLineClass(mockLineHandle, "background", "background")).thenReturn(
        mockLineHandle,
      )
      when(() => mockDoc.removeLineClass(mockLineHandle, "text", "text")).thenReturn(mockLineHandle)
      when(() => mockDoc.removeLineClass(mockLineHandle, "wrap", "wrap")).thenReturn(mockLineHandle)
      when(() => mockDoc.removeLineClass(mockLineHandle, "gutter", "gutter")).thenReturn(
        mockLineHandle,
      )

      Docs.removeLineClasses(mockDoc, mockLineHandle, {
        background: ["background"],
        text: ["text"],
        wrap: ["wrap"],
        gutter: ["gutter"],
      })
    })

    it("has no effect when no line classes given", () => {
      const mockDoc = mock<Doc>()
      const mockLineHandle = mock<LineHandle>()

      Docs.removeLineClasses(mockDoc, mockLineHandle, {
        background: [],
        text: undefined,
        wrap: [],
        gutter: undefined,
      })
    })
  })

  describe("isSelected", () => {
    const doc = new Doc("a\nb\nc")
    doc.setSelections([
      { head: { line: 0, ch: 0 }, anchor: { line: 0, ch: 1 } },
      { head: { line: 2, ch: 0 }, anchor: { line: 2, ch: 1 } },
    ])

    it("returns true when head to anchor selection", () => {
      expect(
        Docs.isSelected(doc, Range.of({ from: { line: 2, ch: 0 }, to: { line: 2, ch: 1 } })),
      ).toBeTrue()
    })

    it("returns true when anchor to head selection", () => {
      expect(
        Docs.isSelected(doc, Range.of({ from: { line: 2, ch: 1 }, to: { line: 2, ch: 0 } })),
      ).toBeTrue()
    })

    it("returns false when not selected, out of range", () => {
      expect(
        Docs.isSelected(doc, Range.of({ from: { line: 1, ch: 0 }, to: { line: 1, ch: 1 } })),
      ).toBeFalse()
    })

    it("returns false when not selected, not entire range", () => {
      expect(
        Docs.isSelected(doc, Range.of({ from: { line: 2, ch: 0 }, to: { line: 2, ch: 0 } })),
      ).toBeFalse()
    })
  })

  describe("clampCursorToRange", () => {
    it("clamps cursor when before range ", () => {
      const mockDoc = mock<Doc>()
      when(() => mockDoc.getCursor()).thenReturn({ line: 0, ch: 0 })
      when(() =>
        mockDoc.setCursor({ line: 0, ch: 1 }, undefined, { origin: Origin.RenderHandler }),
      ).thenReturn()

      Docs.clampCursorToRange(
        mockDoc,
        Range.of({ from: { line: 0, ch: 1 }, to: { line: 0, ch: 2 } }),
        Origin.RenderHandler,
      )
    })

    it("clamps cursor when after range ", () => {
      const mockDoc = mock<Doc>()
      when(() => mockDoc.getCursor()).thenReturn({ line: 0, ch: 2 })
      when(() =>
        mockDoc.setCursor({ line: 0, ch: 1 }, undefined, { origin: Origin.RenderHandler }),
      ).thenReturn()

      Docs.clampCursorToRange(
        mockDoc,
        Range.of({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 1 } }),
        Origin.RenderHandler,
      )
    })

    it("leaves cursor alone when at start of range ", () => {
      Docs.clampCursorToRange(
        InlineDoc`^ `,
        Range.of({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 1 } }),
        Origin.RenderHandler,
      )
    })

    it("leaves cursor alone when inside range ", () => {
      Docs.clampCursorToRange(
        InlineDoc` ^ `,
        Range.of({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 3 } }),
        Origin.RenderHandler,
      )
    })

    it("leaves cursor alone when at end of range ", () => {
      Docs.clampCursorToRange(
        InlineDoc` ^`,
        Range.of({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 1 } }),
        Origin.RenderHandler,
      )
    })
  })
})
