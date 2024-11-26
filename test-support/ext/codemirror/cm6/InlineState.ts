import { EditorSelection, EditorState, Text } from "@codemirror/state"

import { nil } from "@ext/stdlib/existence"

import { Any } from "test-support/fixtures/cm6/Any"

export function InlineState(arr: TemplateStringsArray): EditorState {
  const text = arr.join("").split("\n")
  const lines = trimMinIndent(removeSurroundingNewlines(text))

  return stateWithSelection(lines)
}

function removeSurroundingNewlines(lines: readonly string[]): readonly string[] {
  if (lines.length <= 1) return lines

  return lines.slice(1, lines.length - 1)
}

function trimMinIndent(lines: readonly string[]): readonly string[] {
  const minIndent = Math.min(...lines.map((it) => it.length - it.trimStart().length))
  return lines.map((it) => it.slice(minIndent))
}

function stateWithSelection(lines: readonly string[]): EditorState {
  const removed = removeSelection(lines)
  if (nil(removed)) return Any.stateWith({ doc: Text.of(lines) })

  const { replacedLines, selection } = removed

  return Any.stateWith({
    doc: Text.of(replacedLines),
    selection:
      "pos" in selection
        ? EditorSelection.create([EditorSelection.cursor(selection.pos)])
        : EditorSelection.create([EditorSelection.range(selection.anchor, selection.head)]),
  })
}

function removeSelection(lines: readonly string[]):
  | {
      replacedLines: readonly string[]
      selection: { pos: number } | { anchor: number; head: number }
    }
  | undefined {
  const text = lines.join("\n")
  const startIndex = text.indexOf("^")

  if (startIndex === -1) return undefined

  const endIndex = text.indexOf("$")
  const replacedText = text.replace("^", "").replace("$", "")

  return {
    replacedLines: replacedText.split("\n"),
    selection: endIndex === -1 ? { pos: startIndex } : { anchor: startIndex, head: endIndex - 1 },
  }
}
