import { EditorState } from "@codemirror/state"
import { EditorView, WidgetType } from "@codemirror/view"

import { Html } from "@ext/dom/Html"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeDocs } from "@cm-extension/cm6/model/CodeDocs"
import { CodeEditorStates } from "@cm-extension/cm6/model/CodeEditorStates"
import { CodeBlockClass as Cb } from "@cm-extension/cm6/theme/style/CodeBlockClass"
import { FontAwesomeClass as Fa } from "@cm-extension/cm6/theme/style/FontAwesomeClass"

const { span, i, button } = Html

/**
 * {@link WidgetType}s for {@link CodeBlock}s.
 */
export namespace Widgets {
  export interface OpeningFenceProps {
    readonly codeBlock: CodeBlock
  }

  /**
   * {@link WidgetType} that replaces an opening fence.
   */
  export class OpeningFence extends WidgetType {
    private static readonly copyButtonResetMillis = 3_000

    readonly codeBlock: CodeBlock

    static create(props: OpeningFenceProps): OpeningFence {
      return new OpeningFence(props)
    }

    private constructor({ codeBlock }: OpeningFenceProps) {
      super()
      this.codeBlock = codeBlock
    }

    /**
     * Returns a wrapper that wraps the opening fence text (with lang) and a button to copy code.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention -- WidgetType has this
    toDOM(view: EditorView): HTMLSpanElement {
      const icon = i({ className: `${Fa.solid} ${Fa.clipboard}` })

      const btn = button({
        children: [icon],
        className: Cb.copyBtn,
        onClick: this.generateCopyButtonOnClick(view.state, icon),
        title: "Copy Code",
      })

      return span({
        className: Cb.startWidget,
        children: [
          span({ className: `${Cb.openingFence}`, textContent: this.codeBlock.openingFenceText }),
          btn,
        ],
      })
    }

    private generateCopyButtonOnClick(
      state: EditorState,
      icon: HTMLElement,
    ): (e: MouseEvent) => void {
      const includeFences = CodeEditorStates.getConfig(state).copyFormat === "fencedCode"

      const onClick = (e: MouseEvent): void => {
        const copyButton = e.currentTarget as HTMLElement

        const code = CodeDocs.getCode(state.doc, this.codeBlock, { includeFences })
        void this.handleCopyButtonClicked({ code, copyButton, icon, onClick })
      }
      return onClick
    }

    private async handleCopyButtonClicked({
      code,
      copyButton,
      icon,
      onClick,
    }: {
      code: string
      copyButton: HTMLElement
      icon: HTMLElement
      onClick: (e: MouseEvent) => void
    }): Promise<void> {
      Html.removeOnClick(copyButton, onClick)

      await navigator.clipboard.writeText(code)

      Html.addClass(copyButton, Cb.copied)
      Html.swapClass(icon, { from: Fa.clipboard, to: Fa.clipboardCheck })

      window.setTimeout(() => {
        Html.addOnClick(copyButton, onClick)
        Html.removeClass(copyButton, Cb.copied)
        Html.swapClass(icon, { from: Fa.clipboardCheck, to: Fa.clipboard })
      }, OpeningFence.copyButtonResetMillis)
    }
  }

  export interface ClosingFenceProps {
    readonly codeBlock: CodeBlock
  }

  /**
   * {@link WidgetType} that replaces a closing fence.
   */
  export class ClosingFence extends WidgetType {
    readonly codeBlock: CodeBlock

    static create(props: ClosingFenceProps): ClosingFence {
      return new ClosingFence(props)
    }

    private constructor({ codeBlock }: ClosingFenceProps) {
      super()
      this.codeBlock = codeBlock
    }

    /**
     * Returns a wrapper that wraps the closing fence text and the lang.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention -- WidgetType has this
    toDOM(_view: EditorView): HTMLSpanElement {
      return span({
        className: Cb.endWidget,
        children: [
          span({ className: `${Cb.closingFence}`, textContent: this.codeBlock.closingFenceText }),
          span({ className: `${Cb.lang}`, textContent: this.codeBlock.lang }),
        ],
      })
    }
  }
}
