import { autocompletion } from "@codemirror/autocomplete"
import { markdown } from "@codemirror/lang-markdown"
import { indentUnit, syntaxHighlighting } from "@codemirror/language"
import { EditorState, EditorStateConfig } from "@codemirror/state"
import { drawSelection, EditorView, rectangularSelection } from "@codemirror/view"
import { classHighlighter } from "@lezer/highlight"
import { GFM as GitHubFlavoredMarkdownExtension } from "@lezer/markdown"
import { describe, expect, it } from "vitest"

import { BetterCodeBlocks } from "@cm-extension/cm6/BetterCodeBlocks"
import { Extensions } from "@cm-extension/cm6/Extensions"
import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"
import { Config } from "@cm-extension/cm6/model/Config"

import { InlineText } from "test-support/ext/codemirror/cm6/InlineText"

describe("BetterCodeBlocks integration test", () => {
  it("registers extensions", () => {
    const view = createView({
      doc: InlineText`
        ~~~typescript
        console.info('Hello World')
        ~~~
      `,
    })

    expect(CodeEditorStates.getConfig(view.state)).toBe(config)
    expect(CodeEditorStates.getCodeBlocks(view.state)).toStrictEqual([
      CodeBlock.of({
        openingFence: { from: 0, to: 13, number: 1, text: "~~~typescript" },
        closingFence: { from: 42, to: 45, number: 3, text: "~~~" },
        lang: "typescript",
      }),
    ])
    expect(view.plugin(Extensions.viewPlugin)).toBeDefined()
  })
})

const config: Config = {
  completedLanguages: ["javascript", "python", "typescript"],
  completion: "enabled",
  rendering: "enabled",
  selectAllCapturing: "enabled",
  cornerStyle: "round",
  renderLayout: "standard",
  excludedLanguages: ["excluded"],
  copyFormat: "code",
}

function createView(stateConfig: Pick<EditorStateConfig, "doc" | "selection"> = {}): EditorView {
  return new EditorView({
    ...stateConfig,
    extensions: [
      EditorState.allowMultipleSelections.of(true),
      rectangularSelection(),
      drawSelection(),
      EditorState.tabSize.of(4),
      indentUnit.of("\t"),
      syntaxHighlighting(classHighlighter),
      markdown({ extensions: [GitHubFlavoredMarkdownExtension] }),

      BetterCodeBlocks.extension(config),
      autocompletion({ override: [BetterCodeBlocks.completionSource(config)] }),
    ],
    parent: document.body,
  })
}
