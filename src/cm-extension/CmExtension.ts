import CodeMirror, { Editor } from "codemirror"

import { CmExtensionRequestHandler } from "@cm-extension-ipc/model/handler"

import { CompleteHandler } from "@cm-extension/handler/CompleteHandler"
import { RenderHandler } from "@cm-extension/handler/RenderHandler"
import { RequestHandler } from "@cm-extension/handler/RequestHandler"
import { SelectHandler } from "@cm-extension/handler/SelectHandler"
import { Config } from "@cm-extension/model/Config"

export interface CmExtensionProps {
  readonly codeMirror: typeof CodeMirror
  readonly completeHandler: CompleteHandler
  readonly config: Config
  readonly editor: Editor
  readonly renderHandler: RenderHandler
  readonly requestHandler: RequestHandler
  readonly selectHandler: SelectHandler
}

/**
 * The {@link extensionName} Code Mirror extension.
 *
 * Adds event handlers to {@link codeMirror}:
 * - On change, {@link renderHandler} renders code fences if {@link config#rendering} is `enabled`
 * - On `Enter` pressed, {@link completeHandler} automatically completes incomplete
 * code fences if {@link config#completion} is `enabled`
 * - On `Select All` performed, {@link selectHandler} selects the code within the active
 * code fence if {@link config#selectAllCapturing} is `enabled`
 *
 * Defines a code mirror extension with {@link CodeMirror#defineExtension} that handles
 * inter-process communication from the Joplin plugin using {@link requestHandler}.
 *
 * Injects data attributes into the root CodeMirror wrapper {@link HTMLElement}:
 * - Sets `data-cb-corner-style` to {@link config#cornerStyle}
 * - Sets `data-cb-rendering` to {@link config#rendering}
 * - Sets `data-cb-render-layout` to {@link config#renderLayout}
 *
 * Renders code fences immediately with {@link renderHandler}.
 *
 * @see https://codemirror.net/5/doc/manual.html#api
 */
export class CmExtension {
  static readonly extensionName = "BetterCodeBlocks"

  static create(props: CmExtensionProps): CmExtension {
    return new CmExtension(props)
  }

  private constructor(props: CmExtensionProps) {
    injectHtmlDataAttributes(props)
    registerEventHandlers(props)
    defineExtension(props)
  }
}

function injectHtmlDataAttributes({ config, editor }: CmExtensionProps): void {
  const codeMirrorWrapper = editor.getWrapperElement()

  codeMirrorWrapper.dataset.cbCornerStyle = config.cornerStyle
  codeMirrorWrapper.dataset.cbRendering = config.rendering
  codeMirrorWrapper.dataset.cbRenderLayout = config.renderLayout
}

function registerEventHandlers({
  completeHandler,
  config,
  editor,
  renderHandler,
  selectHandler,
}: CmExtensionProps): void {
  if (config.rendering === "enabled") {
    renderHandler.renderNow(editor)

    editor.on("change", (cm, change) => renderHandler.renderOnChange(cm, change))
  }

  if (config.completion === "enabled") {
    editor.on("keydown", (cm, keyboardEvent) => completeHandler.completeOnEnter(cm, keyboardEvent))
  }

  if (config.selectAllCapturing === "enabled") {
    editor.on("beforeSelectionChange", (cm, change) =>
      selectHandler.selectOnSelectAll(cm.getDoc(), change),
    )
  }
}

function defineExtension({ codeMirror, requestHandler }: CmExtensionProps): void {
  const extension: CmExtensionRequestHandler = (it) => requestHandler.handle(it)
  codeMirror.defineExtension(CmExtension.extensionName, extension)
}
