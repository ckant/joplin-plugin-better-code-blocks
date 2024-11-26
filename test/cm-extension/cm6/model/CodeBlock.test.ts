import { describe, expect, it } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"

describe("CodeBlock", () => {
  describe("start", () => {
    it("returns start", () => {
      expect(codeBlock.start).toBe(0)
    })
  })

  describe("end", () => {
    it("returns end", () => {
      expect(codeBlock.end).toBe(16)
    })
  })

  describe("openingFenceStart", () => {
    it("returns opening fence start", () => {
      expect(codeBlock.openingFenceStart).toBe(0)
    })
  })

  describe("openingFenceEnd", () => {
    it("returns opening fence end", () => {
      expect(codeBlock.openingFenceEnd).toBe(7)
    })
  })

  describe("openingFenceText", () => {
    it("returns opening fence text", () => {
      expect(codeBlock.openingFenceText).toBe("```lang")
    })
  })

  describe("closingFenceStart", () => {
    it("returns closing fence start", () => {
      expect(codeBlock.closingFenceStart).toBe(13)
    })
  })

  describe("closingFenceEnd", () => {
    it("returns closing fence end", () => {
      expect(codeBlock.closingFenceEnd).toBe(16)
    })
  })

  describe("closingFenceText", () => {
    it("returns closing fence text", () => {
      expect(codeBlock.closingFenceText).toBe("```")
    })
  })

  describe("firstLine", () => {
    it("returns first line", () => {
      expect(codeBlock.firstLine).toBe(1)
    })
  })

  describe("lastLine", () => {
    it("returns last line", () => {
      expect(codeBlock.lastLine).toBe(3)
    })
  })

  describe("codeStart", () => {
    it("returns code start when there's code", () => {
      expect(codeBlock.codeStart).toBe(8)
    })

    it("returns undefined when there's no code", () => {
      expect(codeBlockWithoutCode.codeStart).toBeUndefined()
    })
  })

  describe("codeEnd", () => {
    it("returns code end when there's code", () => {
      expect(codeBlock.codeEnd).toBe(12)
    })

    it("returns undefined when there's no code", () => {
      expect(codeBlockWithoutCode.codeEnd).toBeUndefined()
    })
  })

  describe("firstCodeLine", () => {
    it("returns first code line when there's code", () => {
      expect(codeBlock.firstCodeLine).toBe(2)
    })

    it("returns undefined when there's no code", () => {
      expect(codeBlockWithoutCode.firstCodeLine).toBeUndefined()
    })
  })

  describe("lastCodeLine", () => {
    it("returns last code line when there's code", () => {
      expect(codeBlock.lastCodeLine).toBe(2)
    })

    it("returns undefined when there's no code", () => {
      expect(codeBlockWithoutCode.lastCodeLine).toBeUndefined()
    })
  })

  describe("codeLineCount", () => {
    it("returns code line count", () => {
      expect(codeBlock.codeLineCount).toBe(1)
    })

    it("returns 0 when there's no code", () => {
      expect(codeBlockWithoutCode.codeLineCount).toBe(0)
    })
  })

  describe("codeLines", () => {
    it("returns Iterable over code lines when there's code", () => {
      expect([...codeBlock.codeLines]).toStrictEqual([2])
    })

    it("returns empty Iterable when there's no code", () => {
      expect([...codeBlockWithoutCode.codeLines]).toBeEmpty()
    })
  })

  describe("hasCode", () => {
    it("returns `is CodeBlockWithCode` when there's code", () => {
      expect(codeBlock.hasCode()).toBeTrue()
    })

    it("returns `is not CodeBlockWithCode` when there's no code", () => {
      expect(codeBlockWithoutCode.hasCode()).toBeFalse()
    })
  })

  describe("includesRange", () => {
    describe("with fences", () => {
      it("returns true when includes range", () => {
        expect(codeBlock.includesRange({ from: 0, to: 1 }, { includeFences: true })).toBeTrue()
      })

      it("returns false when doesn't include range", () => {
        expect(codeBlock.includesRange({ from: 17, to: 18 }, { includeFences: true })).toBeFalse()
      })
    })

    describe("without fences", () => {
      it("returns true when includes range", () => {
        expect(codeBlock.includesRange({ from: 8, to: 9 }, { includeFences: false })).toBeTrue()
      })

      it("returns false when doesn't include range", () => {
        expect(codeBlock.includesRange({ from: 6, to: 7 }, { includeFences: false })).toBeFalse()
      })

      it("returns false when no code", () => {
        expect(
          codeBlockWithoutCode.includesRange({ from: 4, to: 4 }, { includeFences: false }),
        ).toBeFalse()
      })
    })
  })

  describe("isExactRange", () => {
    describe("with fences", () => {
      it("returns true when is exact range", () => {
        expect(codeBlock.isExactRange({ from: 0, to: 16 }, { includeFences: true })).toBeTrue()
      })

      it("returns false when isn't exact range", () => {
        expect(codeBlock.isExactRange({ from: 0, to: 15 }, { includeFences: true })).toBeFalse()
      })
    })

    describe("without fences", () => {
      it("returns true when is exact range", () => {
        expect(codeBlock.isExactRange({ from: 8, to: 12 }, { includeFences: false })).toBeTrue()
      })

      it("returns false when isn't exact range", () => {
        expect(codeBlock.isExactRange({ from: 7, to: 12 }, { includeFences: false })).toBeFalse()
      })

      it("returns false when no code", () => {
        expect(
          codeBlockWithoutCode.isExactRange({ from: 3, to: 3 }, { includeFences: false }),
        ).toBeFalse()
      })
    })
  })

  describe("touchesRange", () => {
    describe("with fences", () => {
      it("returns true when touches range", () => {
        expect(codeBlock.touchesRange({ from: 16, to: 18 }, { includeFences: true })).toBeTrue()
      })

      it("returns false when doesn't touch range", () => {
        expect(codeBlock.touchesRange({ from: 17, to: 18 }, { includeFences: true })).toBeFalse()
      })
    })

    describe("without fences", () => {
      it("returns true when touches range", () => {
        expect(codeBlock.touchesRange({ from: 0, to: 8 }, { includeFences: false })).toBeTrue()
      })

      it("returns false when doesn't touch range", () => {
        expect(codeBlock.touchesRange({ from: 0, to: 7 }, { includeFences: false })).toBeFalse()
      })

      it("returns false when no code", () => {
        expect(
          codeBlockWithoutCode.touchesRange({ from: 0, to: 7 }, { includeFences: false }),
        ).toBeFalse()
      })
    })
  })
})

const codeBlock = CodeBlock.of({
  openingFence: { from: 0, to: 7, number: 1, text: "```lang" },
  closingFence: { from: 13, to: 16, number: 3, text: "```" },
  lang: "lang",
})

const codeBlockWithoutCode = CodeBlock.of({
  openingFence: { from: 0, to: 3, number: 2, text: "```" },
  closingFence: { from: 4, to: 7, number: 3, text: "```" },
  lang: undefined,
})
