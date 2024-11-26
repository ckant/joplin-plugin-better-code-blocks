import { CmContentScript, CmContentScriptAssets, CodeMirror5, CodeMirror6 } from "api/types"
import { Editor } from "codemirror"

import { JoplinPlugins } from "@ext/joplin/JoplinPlugins"

import { CmExtension as Cm5Extension } from "@cm-extension/cm5/CmExtension"

const cmExtensionOption = `enable${Cm5Extension.extensionName}`

export interface ContentScriptProps {
  readonly createCm6Extension: (codeMirror: CodeMirror6) => Promise<void>
  readonly createCm5Extension: (codeMirror: CodeMirror5, editor: Editor) => Promise<Cm5Extension>
  readonly styles: readonly string[]
}

/**
 * Joplin content script for the BetterCodeBlocks Code Mirror extension.
 *
 * Registers the Code Mirror extension created by {@link createCm5Extension}.
 * Specifies assets of the given {@link styles}.
 *
 * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#codemirrorplugin
 */
export class ContentScript implements CmContentScript {
  private readonly createCm6Extension: ContentScriptProps["createCm6Extension"]
  private readonly createCm5Extension: ContentScriptProps["createCm5Extension"]
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
    this.createCm6Extension = props.createCm6Extension
    this.createCm5Extension = props.createCm5Extension
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
  plugin(codeMirror: CodeMirror5 | CodeMirror6): void {
    if (JoplinPlugins.isCodeMirror6(codeMirror)) {
      this.initializeCm6Extension(codeMirror)
    } else {
      this.initializeCm5Extension(codeMirror)
    }
  }

  /**
   * Specifies to load {@link styles} for use by Code Mirror extension.
   */
  assets: CmContentScriptAssets = () => this.styles.map((name) => ({ name }))

  private initializeCm6Extension(codemirror: CodeMirror6): void {
    void this.createCm6Extension(codemirror)
  }

  private initializeCm5Extension(codeMirror: CodeMirror5): void {
    codeMirror.defineOption(cmExtensionOption, false, (editor, newValue: boolean) => {
      if (!newValue) return
      void this.createCm5Extension(codeMirror, editor)
    })
  }
}
