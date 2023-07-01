import { ReadonlyDoc } from "codemirror"

import { Html } from "@ext/dom/Html"

import { CodeBlock } from "@cm-extension/model/CodeBlock"
import { CodeDocs } from "@cm-extension/model/CodeDocs"
import { Config } from "@cm-extension/model/Config"
import { CodeBlockClass as Cb } from "@cm-extension/style/CodeBlockClass"
import { FontAwesomeClass as Fa } from "@cm-extension/style/FontAwesomeClass"

const copyButtonResetMillis = 3_000
const { button, i } = Html

export interface CopyButtonGeneratorProps {
  readonly clipboard: Clipboard
  readonly config: Config
  readonly window: Window
}

/**
 * Generates a button to copy code fence code based on the given {@link config}.
 *
 * Uses {@link clipboard} for copying text and {@link window#setTimeout} for transitions.
 */
export class CopyButtonGenerator {
  private readonly clipboard: Clipboard
  private readonly config: Config
  private readonly window: Window

  static create(props: CopyButtonGeneratorProps): CopyButtonGenerator {
    return new CopyButtonGenerator(props)
  }

  private constructor(props: CopyButtonGeneratorProps) {
    this.clipboard = props.clipboard
    this.config = props.config
    this.window = props.window
  }

  /**
   * Generates a copy button for the given {@link codeBlock} in the {@link doc}.
   */
  generate(doc: ReadonlyDoc, codeBlock: CodeBlock): HTMLElement {
    const icon = i({ className: `${Fa.solid} ${Fa.clipboard}` })

    return button({
      children: [icon],
      className: Cb.copyBtn,
      onClick: this.generateCopyButtonOnClick(doc, codeBlock, icon),
      title: "Copy Code",
    })
  }

  private generateCopyButtonOnClick(
    doc: ReadonlyDoc,
    codeBlock: CodeBlock,
    icon: HTMLElement,
  ): (e: MouseEvent) => void {
    const includeFences = this.config.copyFormat === "fencedCode"

    const onClick = (e: MouseEvent): void => {
      const copyButton = e.currentTarget as HTMLElement

      const code = CodeDocs.getCode(doc, codeBlock, { includeFences })
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

    await this.clipboard.writeText(code)

    Html.addClass(copyButton, Cb.copied)
    Html.swapClass(icon, { from: Fa.clipboard, to: Fa.clipboardCheck })

    this.window.setTimeout(() => {
      Html.addOnClick(copyButton, onClick)
      Html.removeClass(copyButton, Cb.copied)
      Html.swapClass(icon, { from: Fa.clipboardCheck, to: Fa.clipboard })
    }, copyButtonResetMillis)
  }
}
