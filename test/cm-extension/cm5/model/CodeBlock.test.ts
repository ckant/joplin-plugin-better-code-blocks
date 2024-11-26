import { describe, expect, it } from "vitest"

import { LineSegment } from "@ext/codemirror/cm5/LineSegment"

import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"

describe("CodeBlock", () => {
  describe("shiftDownBy", () => {
    it("returns a new CodeBlock with added lines", () => {
      const codeBlock = codeBlockOf({
        startLine: 4,
        endLine: 6,
        lang: "lang",
        openingFence: " ```lang",
        closingFence: " ```",
      })
      const newCodeBlock = codeBlock.shiftDownBy(1)
      expect(newCodeBlock).toStrictEqual(
        codeBlockOf({
          startLine: 5,
          endLine: 7,
          lang: "lang",
          openingFence: " ```lang",
          closingFence: " ```",
        }),
      )
      expect(newCodeBlock).not.toBe(codeBlock)
    })
  })

  describe("isBefore", () => {
    it("is before", () => {
      expect(codeBlockSpanning(0, 1).isBefore(2)).toBe(true)
    })

    it("is overlapping start", () => {
      expect(codeBlockSpanning(0, 1).isBefore(0)).toBe(false)
    })

    it("is overlapping end", () => {
      expect(codeBlockSpanning(0, 1).isBefore(1)).toBe(false)
    })

    it("is after", () => {
      expect(codeBlockSpanning(1, 2).isBefore(0)).toBe(false)
    })

    it("throws Error if negative / not integer", () => {
      expect(() => codeBlockSpanning(0, 1).isBefore(-1)).toThrowError()
    })
  })

  describe("isAfter", () => {
    it("is before", () => {
      expect(codeBlockSpanning(0, 1).isAfter(2)).toBe(false)
    })

    it("is overlapping start", () => {
      expect(codeBlockSpanning(0, 1).isAfter(0)).toBe(false)
    })

    it("is overlapping end", () => {
      expect(codeBlockSpanning(0, 1).isAfter(1)).toBe(false)
    })

    it("is after", () => {
      expect(codeBlockSpanning(1, 2).isAfter(0)).toBe(true)
    })

    it("throws Error if negative / not integer", () => {
      expect(() => codeBlockSpanning(0, 1).isAfter(-1)).toThrowError()
    })
  })

  describe("startsAt", () => {
    it("starts at", () => {
      expect(codeBlockSpanning(0, 1).startsAt(0)).toBe(true)
    })

    it("doesn't start at", () => {
      expect(codeBlockSpanning(1, 1).startsAt(0)).toBe(false)
    })

    it("throws Error if negative / not integer", () => {
      expect(() => codeBlockSpanning(0, 1).startsAt(-1)).toThrowError()
    })
  })

  describe("endsAt", () => {
    it("ends at", () => {
      expect(codeBlockSpanning(0, 1).endsAt(1)).toBe(true)
    })

    it("doesn't end at", () => {
      expect(codeBlockSpanning(1, 1).endsAt(0)).toBe(false)
    })

    it("throws Error if negative / not integer", () => {
      expect(() => codeBlockSpanning(0, 1).endsAt(-1)).toThrowError()
    })
  })

  describe("containsLine", () => {
    describe("without options", () => {
      it("contains line", () => {
        expect(codeBlockSpanning(0, 2).containsLine(1)).toBe(true)
      })

      it("doesn't contain start", () => {
        expect(codeBlockSpanning(0, 1).containsLine(0)).toBe(false)
      })

      it("doesn't contain end", () => {
        expect(codeBlockSpanning(0, 1).containsLine(1)).toBe(false)
      })
    })

    describe("excluding fences", () => {
      it("contains line", () => {
        expect(codeBlockSpanning(0, 2).containsLine(1, { includeFences: false })).toBe(true)
      })

      it("doesn't contain start", () => {
        expect(codeBlockSpanning(0, 1).containsLine(0, { includeFences: false })).toBe(false)
      })

      it("doesn't contain end", () => {
        expect(codeBlockSpanning(0, 1).containsLine(1, { includeFences: false })).toBe(false)
      })
    })

    describe("including fences", () => {
      it("contains line", () => {
        expect(codeBlockSpanning(0, 2).containsLine(1, { includeFences: true })).toBe(true)
      })

      it("contains start", () => {
        expect(codeBlockSpanning(0, 2).containsLine(0, { includeFences: true })).toBe(true)
      })

      it("contains end", () => {
        expect(codeBlockSpanning(0, 2).containsLine(2, { includeFences: true })).toBe(true)
      })
    })

    it("throws Error if negative / not integer", () => {
      expect(() => codeBlockSpanning(0, 1).containsLine(-1)).toThrowError()
    })
  })

  describe("size", () => {
    it("empty", () => {
      expect(codeBlockSpanning(0, 1).size).toBe(0)
    })

    it("not empty", () => {
      expect(codeBlockSpanning(0, 2).size).toBe(1)
    })
  })

  describe("isEmpty", () => {
    it("empty", () => {
      expect(codeBlockSpanning(0, 1).isEmpty()).toBe(true)
    })

    it("not empty", () => {
      expect(codeBlockSpanning(0, 2).isEmpty()).toBe(false)
    })
  })

  describe("equals", () => {
    it("equal (with lang)", () => {
      const first = codeBlockOf({
        startLine: 0,
        endLine: 1,
        lang: "typescript",
        openingFence: "```typescript",
        closingFence: "```",
      })
      const second = codeBlockOf({
        startLine: 0,
        endLine: 1,
        lang: "typescript",
        openingFence: "```typescript",
        closingFence: "```",
      })

      expect(first.equals(second)).toBe(true)
      expect(second.equals(first)).toBe(true)
    })

    it("equal (without lang)", () => {
      const first = codeBlockOf({
        startLine: 0,
        endLine: 1,
        openingFence: "```",
        closingFence: "```",
      })
      const second = codeBlockOf({
        startLine: 0,
        endLine: 1,
        openingFence: "```",
        closingFence: "```",
      })

      expect(first.equals(second)).toBe(true)
      expect(second.equals(first)).toBe(true)
    })

    it.each([
      {
        issue: "different start",
        other: codeBlockOf({
          startLine: 1,
          endLine: 1,
          lang: "typescript",
          openingFence: "```typescript",
          closingFence: "```",
        }),
      },
      {
        issue: "different end",
        other: codeBlockOf({
          startLine: 0,
          endLine: 2,
          lang: "typescript",
          openingFence: "```typescript",
          closingFence: "```",
        }),
      },
      {
        issue: "different lang",
        other: codeBlockOf({
          startLine: 0,
          endLine: 1,
          lang: "javascript",
          openingFence: "```typescript",
          closingFence: "```",
        }),
      },
      {
        issue: "different opening fence",
        other: codeBlockOf({
          startLine: 0,
          endLine: 1,
          lang: "typescript",
          openingFence: "~~~typescript",
          closingFence: "```",
        }),
      },
      {
        issue: "different closing fence",
        other: codeBlockOf({
          startLine: 0,
          endLine: 1,
          lang: "typescript",
          openingFence: "```typescript",
          closingFence: "  ```",
        }),
      },
    ])("not equal (with lang) when other has $issue", ({ other }) => {
      const first = codeBlockOf({
        startLine: 0,
        endLine: 1,
        lang: "typescript",
        openingFence: "```typescript",
        closingFence: "```",
      })

      expect(first.equals(other)).toBe(false)
      expect(other.equals(first)).toBe(false)
    })

    it.each([
      {
        issue: "different start",
        other: codeBlockOf({ startLine: 1, endLine: 1, openingFence: "```", closingFence: "```" }),
      },
      {
        issue: "different end",
        other: codeBlockOf({ startLine: 0, endLine: 2, openingFence: "```", closingFence: "```" }),
      },
      {
        issue: "a lang",
        other: codeBlockOf({
          startLine: 0,
          endLine: 1,
          lang: "typescript",
          openingFence: "```",
          closingFence: "```",
        }),
      },
      {
        issue: "different opening fence",
        other: codeBlockOf({ startLine: 0, endLine: 1, openingFence: " ```", closingFence: "```" }),
      },
      {
        issue: "different closing fence",
        other: codeBlockOf({ startLine: 0, endLine: 1, openingFence: "```", closingFence: " ```" }),
      },
    ])("not equal (without lang) when other has $issue", ({ other }) => {
      const first = codeBlockOf({
        startLine: 0,
        endLine: 1,
        openingFence: "```",
        closingFence: "```",
      })

      expect(first.equals(other)).toBe(false)
      expect(other.equals(first)).toBe(false)
    })
  })
})

function codeBlockSpanning(startLine: number, endLine: number): CodeBlock {
  return CodeBlock.of({
    start: LineSegment.of({ line: startLine, from: 0, to: 0 }),
    end: LineSegment.of({ line: endLine, from: 0, to: 0 }),
    lang: undefined,
    openingFence: "opening",
    closingFence: "closing",
  })
}

function codeBlockOf({
  startLine,
  endLine,
  lang,
  openingFence,
  closingFence,
}: {
  startLine: number
  endLine: number
  lang?: string | undefined
  openingFence: string
  closingFence: string
}): CodeBlock {
  return CodeBlock.of({
    start: LineSegment.of({ line: startLine, from: 0, to: 0 }),
    end: LineSegment.of({ line: endLine, from: 0, to: 0 }),
    lang,
    openingFence,
    closingFence,
  })
}
