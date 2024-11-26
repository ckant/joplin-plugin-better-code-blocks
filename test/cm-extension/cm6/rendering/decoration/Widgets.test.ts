import { Arrays } from "@ts-belt"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { Config } from "@cm-extension/cm6/model/Config"
import { Widgets } from "@cm-extension/cm6/rendering/decoration/Widgets"

import { InlineText } from "test-support/ext/codemirror/cm6/InlineText"
import { CondensedString } from "test-support/ext/stdlib/CondensedString"
import { Vitest } from "test-support/ext/vitest/Vitest"
import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"
import { FakeClipboard } from "test-support/fakes/dom/FakeClipboard"
import { FakeWindow } from "test-support/fakes/dom/FakeWindow"
import { Any } from "test-support/fixtures/cm6/Any"

describe("Widgets", () => {
  describe("OpeningFence", () => {
    describe("toDOM", () => {
      it("creates widget", () => {
        const widget = Widgets.OpeningFence.create({ codeBlock }).toDOM(fakeViewOf())

        expect(widget.outerHTML).toStrictEqual(
          CondensedString`
            <span class="cb-start-widget">
              <span class="cb-opening-fence">\`\`\`typescript</span>
              <button class="cb-copy-btn" title="Copy Code">
                <i class="fa-solid fa-clipboard"></i>
              </button>
            </span>
          `,
        )
      })

      describe("copy button", () => {
        let fakeClipboard: FakeClipboard

        beforeEach(() => {
          ;({ fakeClipboard } = viStubGlobals())
        })

        afterEach(() => {
          vi.unstubAllGlobals()
        })

        it("copies code", () => {
          const fakeView = fakeViewOf({ copyFormat: "code" })

          const openingFence = Widgets.OpeningFence.create({ codeBlock }).toDOM(fakeView)
          const copyButton = openingFence.querySelector("button")!
          copyButton.click()

          expect(fakeClipboard.ext.data).toBe(`function main() {\n  console.info("Hello World")\n}`)
        })

        it("copies fenced code", () => {
          const fakeView = fakeViewOf({ copyFormat: "fencedCode" })

          const openingFence = Widgets.OpeningFence.create({ codeBlock }).toDOM(fakeView)
          const copyButton = openingFence.querySelector("button")!
          copyButton.click()

          expect(fakeClipboard.ext.data).toBe(
            `\`\`\`typescript\nfunction main() {\n  console.info("Hello World")\n}\n\`\`\``,
          )
        })
      })

      describe("copy button state transitions", () => {
        let fakeWindow: FakeWindow
        let fakeClipboard: FakeClipboard
        let copyButton: HTMLButtonElement

        beforeEach(() => {
          ;({ fakeWindow, fakeClipboard } = viStubGlobals())

          const fakeView = fakeViewOf({ copyFormat: "code" })
          const openingFence = Widgets.OpeningFence.create({ codeBlock }).toDOM(fakeView)
          copyButton = openingFence.querySelector("button")!
        })

        afterEach(() => {
          vi.unstubAllGlobals()
        })

        it("enters copied state", async () => {
          copyButton.click()

          await Vitest.settlePendingPromises()

          expect(fakeClipboard.ext.data).toBe(`function main() {\n  console.info("Hello World")\n}`)
          expect(copyButton.className).toBe("cb-copy-btn cb-copied")
          expect(copyButton.querySelector("i")!.className).toBe("fa-solid fa-clipboard-check")
        })

        it("ignores clicks while in copied state", async () => {
          copyButton.click()
          await Vitest.settlePendingPromises()
          fakeClipboard.ext.clear()
          copyButton.click()
          await Vitest.settlePendingPromises()

          expect(fakeClipboard.ext.data).toBeEmpty()
        })

        it("sets timeout to exit copied state and re-enter copyable state", async () => {
          copyButton.click()
          await Vitest.settlePendingPromises()

          expect(fakeWindow.ext.setTimeouts).not.toBeEmpty()
          expect(Arrays.head(fakeWindow.ext.setTimeouts)!.timeout).toBe(3000)
        })

        it("re-enters copyable state", async () => {
          copyButton.click()
          await Vitest.settlePendingPromises()

          Arrays.head(fakeWindow.ext.setTimeouts)!.run()

          expect(copyButton.className).toBe("cb-copy-btn")
          expect(copyButton.querySelector("i")!.className).toBe("fa-solid fa-clipboard")

          fakeClipboard.ext.clear()
          copyButton.click()
          await Vitest.settlePendingPromises()

          expect(fakeClipboard.ext.data).toBe(`function main() {\n  console.info("Hello World")\n}`)
        })
      })
    })
  })

  describe("ClosingFence", () => {
    describe("toDOM", () => {
      it("creates widget", () => {
        const widget = Widgets.ClosingFence.create({ codeBlock }).toDOM(fakeViewOf())

        expect(widget.outerHTML).toStrictEqual(
          CondensedString`
            <span class="cb-end-widget">
              <span class="cb-closing-fence">\`\`\`</span>
              <span class="cb-lang">typescript</span>
            </span>
          `,
        )
      })
    })
  })
})

const doc = InlineText`
  \`\`\`typescript
  function main() {
    console.info("Hello World")
  }
  \`\`\`
`

const codeBlock = CodeBlock.of({
  openingFence: { from: 0, to: 13, number: 1, text: "```typescript" },
  closingFence: { from: 64, to: 67, number: 5, text: "```" },
  lang: "typescript",
})

function fakeViewOf(copyFormatConfig?: Pick<Config, "copyFormat">): FakeEditorView {
  return FakeEditorView.create({
    state: Any.stateWith({
      config: {
        ...Config.createDefault(),
        ...(copyFormatConfig ?? {}),
      },
      doc,
    }),
  })
}

function viStubGlobals(): { fakeWindow: FakeWindow; fakeClipboard: FakeClipboard } {
  const fakeWindow = FakeWindow.create({ pauseTimeouts: true })
  const fakeClipboard = FakeClipboard.create()

  vi.stubGlobal("window", fakeWindow)
  vi.stubGlobal("navigator", { clipboard: fakeClipboard })

  return { fakeWindow, fakeClipboard }
}
