import CodeMirror, { Editor } from "codemirror"

import { CmExtension } from "@cm-extension/cm5/CmExtension"
import { Completer } from "@cm-extension/cm5/completer/Completer"
import { CompletionGenerator } from "@cm-extension/cm5/completer/CompletionGenerator"
import { BetweenSpacer } from "@cm-extension/cm5/formatter/BetweenSpacer"
import { EdgeSpacer } from "@cm-extension/cm5/formatter/EdgeSpacer"
import { Formatter } from "@cm-extension/cm5/formatter/Formatter"
import { Opener } from "@cm-extension/cm5/formatter/Opener"
import { CompleteHandler } from "@cm-extension/cm5/handler/CompleteHandler"
import { RenderHandler } from "@cm-extension/cm5/handler/RenderHandler"
import { RequestHandler } from "@cm-extension/cm5/handler/RequestHandler"
import { SelectHandler } from "@cm-extension/cm5/handler/SelectHandler"
import { LineStyleGenerator } from "@cm-extension/cm5/marker/line-styler/LineStyleGenerator"
import { LineStyler } from "@cm-extension/cm5/marker/line-styler/LineStyler"
import { Marker } from "@cm-extension/cm5/marker/Marker"
import { CopyButtonGenerator } from "@cm-extension/cm5/marker/widgeter/CopyButtonGenerator"
import { Widgeter } from "@cm-extension/cm5/marker/widgeter/Widgeter"
import { WidgetGenerator } from "@cm-extension/cm5/marker/widgeter/WidgetGenerator"
import { Config } from "@cm-extension/cm5/model/Config"
import { Parser } from "@cm-extension/cm5/Parser"
import { RangeFinder } from "@cm-extension/cm5/RangeFinder"
import { Renderer } from "@cm-extension/cm5/renderer/Renderer"
import { RenderParser } from "@cm-extension/cm5/renderer/RenderParser"
import { RenderPerformer } from "@cm-extension/cm5/renderer/RenderPerformer"

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
