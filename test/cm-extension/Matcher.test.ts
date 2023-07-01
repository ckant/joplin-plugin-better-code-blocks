import { describe, expect, it } from "vitest"

import { Matcher } from "@cm-extension/Matcher"

describe("Matcher", () => {
  describe("matchStart", () => {
    it.each(matches)("$text should match ($type)", ({ text, match }) => {
      expect(Matcher.matchStart(text)).toStrictEqual(match)
    })

    it.each(mismatches)("$text shouldn't match ($type)", ({ text }) => {
      expect(Matcher.matchStart(text)).toBeUndefined()
    })
  })
})

const matches = [
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
    text: " \t ```",
    match: { indent: " \t ", tag: "```", lang: "", sequence: " \t ```" },
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
    text: " \t`````` \t   l4ngu4g3/+#-   \t  \t  // ## @comment for $var;",
    match: {
      indent: " \t",
      tag: "``````",
      lang: "l4ngu4g3/+#-",
      sequence: " \t`````` \t   l4ngu4g3/+#-   \t  \t  // ## @comment for $var;",
    },
  },
]

const mismatches = [
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
    text: " \t \t```",
  },
  {
    type: "too much indent",
    text: " \t \t",
  },
  {
    type: "h3",
    text: "### typescript",
  },
  {
    type: "unrelated",
    text: "The quick red fox jumps over the orange cat",
  },
]
