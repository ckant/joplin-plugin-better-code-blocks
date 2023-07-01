/**
 * Trims and removes newlines from the given `string`.
 */
export function CondensedString(arr: TemplateStringsArray): string {
  const lines = arr.join("").split("\n")
  return lines
    .slice(1, lines.length - 1)
    .map((line) => line.trim())
    .join("")
}
