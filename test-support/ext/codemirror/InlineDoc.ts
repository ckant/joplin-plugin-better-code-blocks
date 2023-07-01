import { Doc, Position } from "codemirror"

import { def } from "@ext/stdlib/existence"

/**
 * Creates a {@link Doc} from a template string.
 *
 * Strips off the new lines at the start / end surrounding the template string.
 * Sets the {@link Doc} cursor to the position of `^` (if one exists) and deletes the `^`.
 *
 * e.g. the following creates a doc with 2 lines and the cursor placed at the end of the first line:
 * <pre>
 * const doc = InlineDoc\`
 *   first line^
 *   last line
 * \`
 * </pre>
 *
 * The above is equivalent to:
 * ```typescript
 * const doc = new Doc("first line\nsecond line")
 * doc.setCursor({ line: 0, ch: 10 })
 * ```
 */
export function InlineDoc(arr: TemplateStringsArray): Doc {
  const text = arr.join("").split("\n")
  const lines = trimMinIndent(removeSurroundingNewlines(text))

  return docWithCursor(lines)
}

function removeSurroundingNewlines(lines: readonly string[]): readonly string[] {
  if (lines.length <= 1) return lines

  return lines.slice(1, lines.length - 1)
}

function trimMinIndent(lines: readonly string[]): readonly string[] {
  const minIndent = Math.min(...lines.map((it) => it.length - it.trimStart().length))
  return lines.map((it) => it.slice(minIndent))
}

function docWithCursor(lines: readonly string[]): Doc {
  const { replacedLines, cursor } = removeCursor(lines)

  const doc = Doc(replacedLines.join("\n"))
  if (def(cursor)) doc.setCursor(cursor)
  return doc
}

function removeCursor(lines: readonly string[]): {
  replacedLines: readonly string[]
  cursor: Position | undefined
} {
  let cursor: Position | undefined
  const replacedLines = lines.map((it, i) => {
    const cursorIndex = it.indexOf("^")
    if (cursorIndex === -1) return it

    if (def(cursor) || cursorIndex !== it.lastIndexOf("^")) {
      throw new Error("Expected exactly one cursor")
    }

    cursor = { line: i, ch: cursorIndex }
    return it.replace("^", "")
  })

  return { cursor, replacedLines }
}
