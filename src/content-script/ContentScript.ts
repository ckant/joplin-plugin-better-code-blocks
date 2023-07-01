import { CmContentScript, CmContentScriptAssets } from "api/types"
import CodeMirror, { Editor } from "codemirror"

import { nil } from "@ext/stdlib/existence"

import { CmExtension } from "@cm-extension/CmExtension"

const cmExtensionOption = `enable${CmExtension.extensionName}`

export interface ContentScriptProps {
  readonly createCmExtension: (
    codeMirror: typeof CodeMirror,
    editor: Editor,
  ) => Promise<CmExtension>
  readonly styles: readonly string[]
}

/**
 * Joplin content script for the {@link CmExtension.extensionName} Code Mirror extension.
 *
 * Registers the Code Mirror extension created by {@link createCmExtension}.
 * Specifies assets of the given {@link styles}.
 *
 * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#codemirrorplugin
 */
export class ContentScript implements CmContentScript {
  private readonly createCmExtension: ContentScriptProps["createCmExtension"]
  private readonly styles: readonly string[]

  /**
   * Adds no extra addons/keymaps/modes to Code Mirror.
   */
  readonly codeMirrorResources: string[] = []

  /**
   * Adds {@link cmExtensionOption} to Code Mirror which initializes the extension at a later point.
   */
  readonly codeMirrorOptions: Record<string, unknown> = { [cmExtensionOption]: true }

  static create(props: ContentScriptProps): ContentScript {
    return new ContentScript(props)
  }

  private constructor(props: ContentScriptProps) {
    this.createCmExtension = props.createCmExtension
    this.styles = props.styles
  }

  /**
   * Defines (an option that initializes) the {@link codeMirror} extension.
   *
   * This defers initialization of the extension until Joplin creates the Code Mirror
   * {@link Editor}.
   *
   * The {@link Editor} creation passes {@link cmExtensionOption} (= `true`) which
   * in turn triggers the code within the option block.
   *
   * The extension itself initializes asynchronously, as it depends on Joplin state (plugin
   * config) which isn't available until later in the Joplin setup process.
   */
  plugin(codeMirror: typeof CodeMirror): void {
    codeMirror.defineOption(cmExtensionOption, false, (editor, newValue) => {
      if (nil(newValue)) return

      void this.initalizeCmExtension(codeMirror, editor)
    })
  }

  /**
   * Specifies to load {@link styles} for use by Code Mirror extension.
   */
  assets: CmContentScriptAssets = () => this.styles.map((name) => ({ name }))

  private async initalizeCmExtension(
    codeMirror: typeof CodeMirror,
    editor: CodeMirror.Editor,
  ): Promise<void> {
    await this.createCmExtension(codeMirror, editor)
  }
}
