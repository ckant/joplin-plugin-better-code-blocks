import CodeMirror, { Editor } from "codemirror"

import { CmExtension } from "@cm-extension/CmExtension"
import { Completer } from "@cm-extension/completer/Completer"
import { CompletionGenerator } from "@cm-extension/completer/CompletionGenerator"
import { BetweenSpacer } from "@cm-extension/formatter/BetweenSpacer"
import { EdgeSpacer } from "@cm-extension/formatter/EdgeSpacer"
import { Formatter } from "@cm-extension/formatter/Formatter"
import { Opener } from "@cm-extension/formatter/Opener"
import { CompleteHandler } from "@cm-extension/handler/CompleteHandler"
import { RenderHandler } from "@cm-extension/handler/RenderHandler"
import { RequestHandler } from "@cm-extension/handler/RequestHandler"
import { SelectHandler } from "@cm-extension/handler/SelectHandler"
import { LineStyleGenerator } from "@cm-extension/marker/line-styler/LineStyleGenerator"
import { LineStyler } from "@cm-extension/marker/line-styler/LineStyler"
import { Marker } from "@cm-extension/marker/Marker"
import { CopyButtonGenerator } from "@cm-extension/marker/widgeter/CopyButtonGenerator"
import { Widgeter } from "@cm-extension/marker/widgeter/Widgeter"
import { WidgetGenerator } from "@cm-extension/marker/widgeter/WidgetGenerator"
import { Config } from "@cm-extension/model/Config"
import { Parser } from "@cm-extension/Parser"
import { RangeFinder } from "@cm-extension/RangeFinder"
import { Renderer } from "@cm-extension/renderer/Renderer"
import { RenderParser } from "@cm-extension/renderer/RenderParser"
import { RenderPerformer } from "@cm-extension/renderer/RenderPerformer"

const { clipboard } = navigator

export interface CmExtensionsProps {
  readonly codeMirror: typeof CodeMirror
  readonly editor: Editor
  readonly config: Config
}

/**
 * Factories for creating {@link CmExtension}.
 */
export namespace CmExtensions {
  /**
   * Creates a {@link CmExtension} with the given {@link codeMirror},
   * {@link editor}, and {@link config} and injected with other default dependencies.
   */
  export function createDefault({ codeMirror, editor, config }: CmExtensionsProps): CmExtension {
    const parser = Parser.create()

    return CmExtension.create({
      codeMirror,
      editor,
      completeHandler: CompleteHandler.create({
        completer: Completer.create({
          completionGenerator: CompletionGenerator.create({ parser }),
        }),
      }),
      config,
      renderHandler: RenderHandler.create({
        renderer: Renderer.create({
          renderParser: RenderParser.create({ config, parser }),
          renderPerformer: RenderPerformer.create({
            formatter: Formatter.combine(
              BetweenSpacer.create(),
              EdgeSpacer.create(),
              Opener.create(),
            ),
            marker: Marker.combine(
              Widgeter.create({
                widgetGenerator: WidgetGenerator.create({
                  copyButtonGenerator: CopyButtonGenerator.create({ clipboard, config, window }),
                }),
              }),
              LineStyler.create({ lineStyleGenerator: LineStyleGenerator.create() }),
            ),
          }),
        }),
      }),
      requestHandler: RequestHandler.create(),
      selectHandler: SelectHandler.create({ rangeFinder: RangeFinder.create({ parser }) }),
    })
  }
}
