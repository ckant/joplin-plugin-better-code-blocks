import { Completion, CompletionResult, pickedCompletion } from "@codemirror/autocomplete"
import { Guards } from "@ts-belt"
import { describe, expect, it } from "vitest"

import { nil } from "@ext/stdlib/existence"

import { CompletionSource } from "@cm-extension/cm6/completion/CompletionSource"
import { Config } from "@cm-extension/cm6/model/Config"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { FakeCompletionContext } from "test-support/fakes/codemirror/cm6/autocomplete/FakeCompletionContext"
import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"

describe("CompletionSource", () => {
  it("returns no options before early opening fence", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 2, state: InlineState`~~` }),
    )

    expect(result).toBeNull()
  })

  it("returns options for opening fence without lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 3, state: InlineState`~~~` }),
    )!

    expect(result.from).toBe(3)
    expect(textOptionsOf(result)).toStrictEqual([
      ...config.completedLanguages.map((lang) => ({
        label: `~~~${lang}`,
        type: "type",
        boost: undefined,
      })),
      { label: "~~~", type: "type", boost: undefined },
    ])
  })

  it("returns option for opening fence without known lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 4, state: InlineState`~~~a` }),
    )!

    expect(result.from).toBe(4)
    expect(textOptionsOf(result)).toStrictEqual([{ label: "~~~a", type: "type", boost: -1 }])
  })

  it("returns options for opening fence with start of lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 4, state: InlineState`~~~b` }),
    )!

    expect(result?.from).toBe(4)
    expect(textOptionsOf(result)).toStrictEqual([
      { label: `~~~bash`, type: "type", boost: undefined },
      { label: "~~~b", type: "type", boost: -1 },
    ])
  })

  it("returns options for opening fence with known lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 7, state: InlineState`~~~java` }),
    )!

    expect(result.from).toBe(7)
    expect(textOptionsOf(result)).toStrictEqual([
      { label: "~~~java", type: "type", boost: undefined },
      { label: "~~~javascript", type: "type", boost: undefined },
    ])
  })

  it("applies option for opening fence without lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 3, state: InlineState`~~~` }),
    )!

    const completion = getCompletion(result, "~~~")
    const fakeView = applyCompletion(completion)
    expect(fakeView.ext.dispatches).toStrictEqual([
      {
        annotations: pickedCompletion.of(completion),
        changes: { from: 3, insert: "\n\n~~~" },
        selection: { anchor: 4 },
      },
    ])
  })

  it("applies option for opening fence without known lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 9, state: InlineState`~~~custom` }),
    )!

    const completion = getCompletion(result, "~~~custom")
    const fakeView = applyCompletion(completion)
    expect(fakeView.ext.dispatches).toStrictEqual([
      {
        annotations: pickedCompletion.of(completion),
        changes: { from: 9, insert: "\n\n~~~" },
        selection: { anchor: 10 },
      },
    ])
  })

  it("applies option for opening fence with start of lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 4, state: InlineState`~~~j` }),
    )!

    const completion = getCompletion(result, "~~~javascript")
    const fakeView = applyCompletion(completion)
    expect(fakeView.ext.dispatches).toStrictEqual([
      {
        annotations: pickedCompletion.of(completion),
        changes: { from: 4, insert: "avascript\n\n~~~" },
        selection: { anchor: 14 },
      },
    ])
  })

  it("applies option for opening fence with known lang", () => {
    const result = CompletionSource(config)(
      FakeCompletionContext.create({ pos: 7, state: InlineState`~~~java` }),
    )!

    const completion = getCompletion(result, "~~~java")
    const fakeView = applyCompletion(completion)
    expect(fakeView.ext.dispatches).toStrictEqual([
      {
        annotations: pickedCompletion.of(completion),
        changes: { from: 7, insert: "\n\n~~~" },
        selection: { anchor: 8 },
      },
    ])
  })
})

const config = Config.createDefault()

function textOptionsOf(
  result: CompletionResult,
): readonly Pick<Completion, "label" | "type" | "boost">[] {
  return result?.options?.map(({ label, type, boost }) => ({
    label,
    type,
    boost,
  }))
}

function getCompletion(result: CompletionResult, label: string): Completion {
  const option = result.options.find(({ label: optionLabel }) => optionLabel === label)
  if (nil(option)) throw new Error(`Option with label ${label} does not exist`)
  return option
}

function applyCompletion(completion: Completion): FakeEditorView {
  const fakeView = FakeEditorView.create()

  if (!Guards.isFunction(completion.apply)) throw new Error("Completion is not applicable")

  completion.apply(fakeView, completion, -1, -1)
  return fakeView
}
