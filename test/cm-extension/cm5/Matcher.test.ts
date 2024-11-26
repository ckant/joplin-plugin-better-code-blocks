import { describe, expect, it } from "vitest"

import { Matcher } from "@cm-extension/cm5/Matcher"

describe("Matcher", () => {
  describe("matchStart", () => {
    it.each(startPatterns.matches)("$text should match ($type)", ({ text, match }) => {
      expect(Matcher.matchStart(text)).toStrictEqual(match)
    })

    it.each(startPatterns.mismatches)("$text shouldn't match ($type)", ({ text }) => {
      expect(Matcher.matchStart(text)).toBeUndefined()
    })
  })

  describe("matchesEnd", () => {
    it.each(endPatterns.matches)("$text should match $tag ($type)", (endPattern) => {
      expect(Matcher.matchesEnd(endPattern)).toBeTrue()
    })

    it.each(endPatterns.mismatches)("$text shouldn't match $tag ($type)", (endPattern) => {
      expect(Matcher.matchesEnd(endPattern)).toBeFalse()
    })
  })
})

const startPatterns = {
  matches: [
    {
      type: "backticks",
      text: "```",
      match: { indent: "", tag: "```", lang: "", sequence: "```" },
    },
    {
      type: "tildes",
      text: "~~~",
      match: { indent: "", tag: "~~~", lang: "", sequence: "~~~" },
    },
    {
      type: "extra backticks",
      text: "````````",
      match: { indent: "", tag: "````````", lang: "", sequence: "````````" },
    },
    {
      type: "extra tildes",
      text: "~~~~",
      match: { indent: "", tag: "~~~~", lang: "", sequence: "~~~~" },
    },
    {
      type: "indent",
      text: "   ```",
      match: { indent: "   ", tag: "```", lang: "", sequence: "   ```" },
    },
    {
      type: "whitespace after tag",
      text: "```   \t  \t  ",
      match: { indent: "", tag: "```", lang: "", sequence: "```   \t  \t  " },
    },
    {
      type: "chars after tag",
      text: "```$$$",
      match: { indent: "", tag: "```", lang: "", sequence: "```$$$" },
    },
    {
      type: "lang",
      text: "```l4ngu4g3/+#-",
      match: { indent: "", tag: "```", lang: "l4ngu4g3/+#-", sequence: "```l4ngu4g3/+#-" },
    },
    {
      type: "whitespace after lang",
      text: "```typescript   \t  \t  ",
      match: { indent: "", tag: "```", lang: "typescript", sequence: "```typescript   \t  \t  " },
    },
    {
      type: "chars after lang",
      text: "```typescript   \t  \t  // ## @comment for $var;",
      match: {
        indent: "",
        tag: "```",
        lang: "typescript",
        sequence: "```typescript   \t  \t  // ## @comment for $var;",
      },
    },
    {
      type: "mixture of everything",
      text: "  `````` \t   l4ngu4g3/+#-   \t  \t  // ## @comment for $var;",
      match: {
        indent: "  ",
        tag: "``````",
        lang: "l4ngu4g3/+#-",
        sequence: "  `````` \t   l4ngu4g3/+#-   \t  \t  // ## @comment for $var;",
      },
    },
  ],
  mismatches: [
    {
      type: "empty",
      text: "",
    },
    {
      type: "blank",
      text: " \t ",
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

const endPatterns = {
  matches: [
    {
      type: "same backticks",
      tag: "````",
      text: "````",
    },
    {
      type: "same tildes",
      tag: "~~~",
      text: "~~~",
    },
    {
      type: "extra backticks",
      tag: "```",
      text: "````",
    },
    {
      type: "extra tildes",
      tag: "~~~~",
      text: "~~~~~",
    },
    {
      type: "indent",
      tag: "```",
      text: "   ```",
    },
    {
      type: "spaces after tag",
      tag: "```",
      text: "```  ",
    },
    {
      type: "mixture of everything",
      tag: "```",
      text: " ````````  ",
    },
  ],
  mismatches: [
    {
      type: "empty",
      tag: "```",
      text: "",
    },
    {
      type: "blank",
      tag: "```",
      text: " \t ",
    },
    {
      type: "mismatched tags",
      tag: "```",
      text: "~~~",
    },
    {
      type: "too few backticks",
      tag: "````",
      text: "```",
    },
    {
      type: "too few tildes",
      tag: "~~~~",
      text: "~~~",
    },
    {
      type: "too much indent",
      tag: "```",
      text: "    ```",
    },
    {
      type: "tabs in indent",
      tag: "```",
      text: " \t\t```",
    },
    {
      type: "tabs after tag",
      tag: "```",
      text: "```\t",
    },
    {
      type: "text after tag",
      tag: "```",
      text: "``` sdad",
    },
  ],
}
