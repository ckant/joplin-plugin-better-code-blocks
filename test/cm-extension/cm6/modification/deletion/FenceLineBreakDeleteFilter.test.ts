import { describe, expect, it } from "vitest"

import { FenceLineBreakDeleteFilter } from "@cm-extension/cm6/modification/deletion/FenceLineBreakDeleteFilter"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { Any } from "test-support/fixtures/cm6/Any"

describe("FenceLineBreakDeleteFilter", () => {
  it("does nothing when not a backspace", () => {
    FenceLineBreakDeleteFilter(Any.state().update())
  })

  it("does nothing when code block has no code", () => {
    const state = InlineState`
      ~~~lang
      ~~~
    `
    const transaction = state.update({
      userEvent: "delete.backward",
      changes: [{ from: 7, to: 8 }],
    })

    expect(FenceLineBreakDeleteFilter(transaction)).toStrictEqual([transaction])
  })

  it("does nothing when doesn't escape code block backwards", () => {
    const state = InlineState`
      ~~~lang
      code
      ~~~
    `

    const transaction = state.update({
      userEvent: "delete.backward",
      changes: [{ from: 8, to: 9 }],
    })

    expect(FenceLineBreakDeleteFilter(transaction)).toStrictEqual([transaction])
  })

  it("does nothing when doesn't escape code block forwards", () => {
    const state = InlineState`
      ~~~lang
      code
      ~~~
    `

    const transaction = state.update({
      userEvent: "delete.forward",
      changes: [{ from: 11, to: 12 }],
    })

    expect(FenceLineBreakDeleteFilter(transaction)).toStrictEqual([transaction])
  })

  it("prevents delete backward that escapes code block", () => {
    const state = InlineState`
      ~~~lang
      code
      ~~~
    `

    const transaction = state.update({
      userEvent: "delete.backward",
      changes: [{ from: 7, to: 8 }],
    })

    expect(FenceLineBreakDeleteFilter(transaction)).toStrictEqual([{}])
  })

  it("prevents delete forward that escapes code block", () => {
    const state = InlineState`
      ~~~lang
      code
      ~~~
    `

    const transaction = state.update({
      userEvent: "delete.forward",
      changes: [{ from: 12, to: 13 }],
    })

    expect(FenceLineBreakDeleteFilter(transaction)).toStrictEqual([{}])
  })
})
