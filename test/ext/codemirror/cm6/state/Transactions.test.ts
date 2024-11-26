import { EditorSelection } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { Transactions } from "@ext/codemirror/cm6/state/Transactions"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

describe("Transactions", () => {
  describe("isDeleteBackward", () => {
    it("returns true when delete backward", () => {
      const state = InlineState`doc`
      const transaction = state.update({ userEvent: "delete.backward" })

      expect(Transactions.isDeleteBackward(transaction)).toBeTrue()
    })

    it("returns false when not delete backward", () => {
      const state = InlineState`doc`
      const transaction = state.update()

      expect(Transactions.isDeleteBackward(transaction)).toBeFalse()
    })
  })

  describe("isDeleteForward", () => {
    it("returns true when delete forward", () => {
      const state = InlineState`doc`
      const transaction = state.update({ userEvent: "delete.forward" })

      expect(Transactions.isDeleteForward(transaction)).toBeTrue()
    })

    it("returns false when not delete forward", () => {
      const state = InlineState`doc`
      const transaction = state.update()

      expect(Transactions.isDeleteForward(transaction)).toBeFalse()
    })
  })

  describe("isDeleteDirection", () => {
    it("returns true when delete forward", () => {
      const state = InlineState`doc`
      const transaction = state.update({ userEvent: "delete.forward" })

      expect(Transactions.isDeleteDirection(transaction)).toBeTrue()
    })

    it("returns true when delete backward", () => {
      const state = InlineState`doc`
      const transaction = state.update({ userEvent: "delete.backward" })

      expect(Transactions.isDeleteDirection(transaction)).toBeTrue()
    })

    it("returns false when not delete direction", () => {
      const state = InlineState`doc`
      const transaction = state.update({ userEvent: "delete" })

      expect(Transactions.isDeleteDirection(transaction)).toBeFalse()
    })
  })

  describe("isSelectAll", () => {
    const state = InlineState`doc`

    it("returns false when doc changed", () => {
      const transaction = state.update({
        changes: { from: 1, to: 2 },
        selection: { anchor: 0, head: 2 },
      })

      expect(Transactions.isSelectAll(transaction)).toBeFalse()
    })

    it("returns false when no selection", () => {
      const transaction = state.update({})

      expect(Transactions.isSelectAll(transaction)).toBeFalse()
    })

    it("returns false when multiple selections", () => {
      const transaction = state.update({
        selection: EditorSelection.create([EditorSelection.cursor(0), EditorSelection.cursor(1)]),
      })

      expect(Transactions.isSelectAll(transaction)).toBeFalse()
    })

    it("returns false when selection doesn't start at doc start", () => {
      const transaction = state.update({
        selection: { anchor: 1, head: 2 },
      })

      expect(Transactions.isSelectAll(transaction)).toBeFalse()
    })

    it("returns false when selection doesn't end at doc end", () => {
      const transaction = state.update({
        selection: { anchor: 0, head: 1 },
      })

      expect(Transactions.isSelectAll(transaction)).toBeFalse()
    })

    it("returns true when select all", () => {
      const transaction = state.update({
        selection: { anchor: 0, head: 3 },
      })

      expect(Transactions.isSelectAll(transaction)).toBeTrue()
    })
  })
})
