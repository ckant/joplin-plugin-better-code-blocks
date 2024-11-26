import { Text } from "@codemirror/state"

export function InlineText(arr: TemplateStringsArray): Text {
  const text = arr.join("").split("\n")
  const lines = trimMinIndent(removeSurroundingNewlines(text))

  return Text.of(lines)
}

function removeSurroundingNewlines(lines: readonly string[]): readonly string[] {
  if (lines.length <= 1) return lines

  return lines.slice(1, lines.length - 1)
}

function trimMinIndent(lines: readonly string[]): readonly string[] {
  const minIndent = Math.min(...lines.map((it) => it.length - it.trimStart().length))
  return lines.map((it) => it.slice(minIndent))
}
