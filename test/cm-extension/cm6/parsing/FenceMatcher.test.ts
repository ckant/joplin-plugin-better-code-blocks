import { describe, expect, it } from "vitest"

import { FenceMatcher } from "@cm-extension/cm6/parsing/FenceMatcher"

describe("FenceMatcher", () => {
  describe("matchesOpeningFence", () => {
    it.each(patterns.matches)("$text should match ($type)", ({ text }) => {
      expect(FenceMatcher.matchesOpeningFence(text)).toBeTrue()
    })

    it.each(patterns.mismatches)("$text shouldn't match ($type)", ({ text }) => {
      expect(FenceMatcher.matchesOpeningFence(text)).toBeFalse()
    })
  })
})

const patterns = {
  matches: [
    {
      type: "backticks",
      text: "```",
    },
    {
      type: "tildes",
      text: "~~~",
    },
    {
      type: "extra backticks",
      text: "````````",
    },
    {
      type: "extra tildes",
      text: "~~~~",
    },
    {
      type: "indent",
      text: "   ```",
    },
  ],
  mismatches: [
    {
      type: "empty",
      text: "",
    },
    {
      type: "blank",
      text: "  ",
    },
    {
      type: "mixed tags",
      text: "`~`",
    },
    {
      type: "too few backticks",
      text: "``",
    },
    {
      type: "too few tildes",
      text: "~~",
    },
    {
      type: "too much indent",
      text: "    ```",
    },
    {
      type: "tabs in indent",
      text: " \t\t```",
    },
    {
      type: "h3",
      text: "### typescript",
    },
    {
      type: "unrelated",
      text: "The quick red fox jumps over the orange cat",
    },
  ],
}
