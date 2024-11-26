import { EditorSelection } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { EditorSelections } from "@ext/codemirror/cm6/state/EditorSelections"

describe("EditorSelections", () => {
  describe("isSingle", () => {
    it("returns true when single", () => {
      const selection = EditorSelection.single(1)
      expect(EditorSelections.isSingle(selection)).toBeTrue()
    })

    it("returns false when multiple", () => {
      const ranges = [EditorSelection.cursor(0), EditorSelection.cursor(1)]
      const selection = EditorSelection.create(ranges)
      expect(EditorSelections.isSingle(selection)).toBeFalse()
    })
  })

  describe("isMultiple", () => {
    it("returns true when multiple", () => {
      const ranges = [EditorSelection.cursor(0), EditorSelection.cursor(1)]
      const selection = EditorSelection.create(ranges)
      expect(EditorSelections.isMultiple(selection)).toBeTrue()
    })

    it("returns false when single", () => {
      const selection = EditorSelection.single(1)
      expect(EditorSelections.isMultiple(selection)).toBeFalse()
    })
  })

  describe("isSingleCursor", () => {
    it("returns true when single cursor", () => {
      const selection = EditorSelection.single(1)
      expect(EditorSelections.isSingleCursor(selection)).toBeTrue()
    })

    it("returns false when multiple", () => {
      const ranges = [EditorSelection.cursor(0), EditorSelection.cursor(1)]
      const selection = EditorSelection.create(ranges)
      expect(EditorSelections.isSingleCursor(selection)).toBeFalse()
    })

    it("returns false when not cursor", () => {
      const selection = EditorSelection.single(0, 1)
      expect(EditorSelections.isSingleCursor(selection)).toBeFalse()
    })
  })

  describe("singleCursor", () => {
    it("returns single cursor", () => {
      const cursor = EditorSelections.singleCursor({
        pos: 1,
        assoc: -1,
        bidiLevel: 3,
        goalColumn: 4,
      })

      expect(cursor.ranges.length).toBe(1)
      expect(cursor.main.empty).toBe(true)
      expect(cursor.main.head).toBe(1)
      expect(cursor.main.anchor).toBe(1)
      expect(cursor.main.assoc).toBe(-1)
      expect(cursor.main.bidiLevel).toBe(3)
      expect(cursor.main.goalColumn).toBe(4)
    })
  })
})
