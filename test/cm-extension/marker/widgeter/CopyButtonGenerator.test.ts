import { Arrays } from "@ts-belt"
import { beforeEach, describe, expect, it } from "vitest"

import { CopyButtonGenerator } from "@cm-extension/marker/widgeter/CopyButtonGenerator"

import { CondensedString } from "test-support/ext/stdlib/CondensedString"
import { Vitest } from "test-support/ext/vitest/Vitest"
import { FakeClipboard } from "test-support/fakes/dom/FakeClipboard"
import { FakeWindow } from "test-support/fakes/dom/FakeWindow"
import { Any } from "test-support/fixtures/Any"
import { DocData } from "test-support/fixtures/DocData"

describe("CopyButtonGenerator", () => {
  describe("generate", () => {
    it("generates copy button", () => {
      const { doc, codeBlock } = DocData.Any.simple()

      const copyButton = CopyButtonGenerator.create({
        clipboard: FakeClipboard.create(),
        config: Any.config(),
        window: FakeWindow.create({ pauseTimeouts: true }),
      }).generate(doc, codeBlock)

      expect(copyButton).toMatchObject({
        outerHTML: CondensedString`
          <button class="cb-copy-btn" title="Copy Code">
            <i class="fa-solid fa-clipboard"></i>
          </button>
        `,
      })
    })

    describe("on click", () => {
      it("copies code", () => {
        const { doc, codeBlock } = DocData.Any.simple()
        const fakeClipboard = FakeClipboard.create()

        const copyButton = CopyButtonGenerator.create({
          clipboard: fakeClipboard,
          config: Any.configWith({ copyFormat: "code" }),
          window: FakeWindow.create({ pauseTimeouts: true }),
        }).generate(doc, codeBlock)
        copyButton.click()

        expect(fakeClipboard.ext.data).toBe(`function main() {\n  console.info("Hello World")\n}`)
      })

      it("copies fenced code", () => {
        const { doc, codeBlock } = DocData.Any.simple()
        const fakeClipboard = FakeClipboard.create()

        const copyButton = CopyButtonGenerator.create({
          clipboard: fakeClipboard,
          config: Any.configWith({ copyFormat: "fencedCode" }),
          window: FakeWindow.create({ pauseTimeouts: true }),
        }).generate(doc, codeBlock)
        copyButton.click()

        expect(fakeClipboard.ext.data).toBe(
          `\`\`\`typescript\nfunction main() {\n  console.info("Hello World")\n}\n\`\`\``,
        )
      })

      describe("copy state transitions", () => {
        let copyButton: HTMLElement
        let fakeWindow: FakeWindow
        let fakeClipboard: FakeClipboard

        beforeEach(() => {
          const { doc, codeBlock } = DocData.Any.simple()
          fakeClipboard = FakeClipboard.create()
          ;(fakeWindow = FakeWindow.create({ pauseTimeouts: true })),
            (copyButton = CopyButtonGenerator.create({
              clipboard: fakeClipboard,
              config: Any.configWith({ copyFormat: "code" }),
              window: fakeWindow,
            }).generate(doc, codeBlock))
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
})
