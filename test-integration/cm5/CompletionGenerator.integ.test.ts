import { Doc } from "codemirror"
import { describe, expect, it } from "vitest"

import { def } from "@ext/stdlib/existence"

import { InlineDoc } from "test-support/ext/codemirror/cm5/InlineDoc"
import { Any } from "test-support/fixtures/cm5/Any"

describe("CompletionGenerator sanity test", () => {
  describe("generate", () => {
    it.each(named(completions))("$testName", ({ doc, generates }) => {
      expect(def(Any.completionGenerator().generate(doc))).toBe(generates)
    })
  })
})

function named(completions: readonly Completion[]): readonly (Completion & { testName: string })[] {
  return completions.map((completion) => {
    const { doc, generates } = completion

    return {
      ...completion,
      testName: `"${doc.getValue()}" with cursor at line ${doc.getCursor().line} ${
        generates ? "generates completion" : "does not generate completion"
      }`,
    }
  })
}

interface Completion {
  doc: Doc
  generates: boolean
  reason: string
}

const completions: readonly Completion[] = [
  {
    doc: InlineDoc`
      ~~~^
    `,
    generates: true,
    reason: "results in matching start and end tag of single code block",
  },
  {
    doc: InlineDoc`
      ~~~lang^
    `,
    generates: true,
    reason: "results in matching start and end tag of single code block",
  },
  {
    doc: InlineDoc`
      ~~~^
      ~~~
    `,
    generates: false,
    reason: "is already complete / results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang^
      ~~~
    `,
    generates: false,
    reason: "is already complete / results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~^
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~lang^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang^
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~lang^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~^
      ~~~
      ~~~
    `,
    generates: true,
    reason: "results in matching start and end tag of first of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~^
      ~~~
    `,
    generates: false,
    reason: "results in end tag of first code block and start tag of second code block",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~
      ~~~^
    `,
    generates: true,
    reason: "results in matching start and end tag of second of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang^
      ~~~
      ~~~
    `,
    generates: true,
    reason: "results in matching start and end tag of first of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~^
      ~~~
    `,
    generates: false,
    reason: "results in end tag of first code block and start tag of second code block",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~
      ~~~^
    `,
    generates: true,
    reason: "results in matching start and end tag of second of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~^
      ~~~lang
      ~~~
    `,
    generates: true,
    reason: "results in matching start and end tag of second of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~lang^
      ~~~
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~lang
      ~~~^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~^
      ~~~
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~^
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~
      ~~~lang^
    `,
    generates: true,
    reason: "results in matching start and end tag of second of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang^
      ~~~lang
      ~~~
    `,
    generates: true,
    reason: "results in matching start and end tag of first of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~lang^
      ~~~
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~lang
      ~~~^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang^
      ~~~
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~^
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~
      ~~~lang^
    `,
    generates: true,
    reason: "results in matching start and end tag of second of two code blocks",
  },
  {
    doc: InlineDoc`
      ~~~^
      ~~~lang
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~lang^
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~
      ~~~lang
      ~~~lang^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang^
      ~~~lang
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~lang^
      ~~~lang
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
  {
    doc: InlineDoc`
      ~~~lang
      ~~~lang
      ~~~lang^
    `,
    generates: false,
    reason: "results in invalid code blocks",
  },
]
