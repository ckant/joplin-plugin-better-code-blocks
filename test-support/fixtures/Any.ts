import { Dicts } from "@ts-belt"

import { Retrier } from "@ext/stdlib/Retrier"

import { PluginSettings } from "@joplin-plugin/settings/PluginSettings"

import { Completer } from "@cm-extension/completer/Completer"
import { CompletionGenerator } from "@cm-extension/completer/CompletionGenerator"
import { BetweenSpacer } from "@cm-extension/formatter/BetweenSpacer"
import { EdgeSpacer } from "@cm-extension/formatter/EdgeSpacer"
import { Opener } from "@cm-extension/formatter/Opener"
import { RequestHandler } from "@cm-extension/handler/RequestHandler"
import { SelectHandler } from "@cm-extension/handler/SelectHandler"
import { LineStyleGenerator } from "@cm-extension/marker/line-styler/LineStyleGenerator"
import { CopyButtonGenerator } from "@cm-extension/marker/widgeter/CopyButtonGenerator"
import { Config } from "@cm-extension/model/Config"
import { Parser } from "@cm-extension/Parser"
import { RangeFinder } from "@cm-extension/RangeFinder"

import { FakeClipboard } from "test-support/fakes/dom/FakeClipboard"
import { FakeWindow } from "test-support/fakes/dom/FakeWindow"

type New<T> = () => T
type NewWith<T> = (arg: Partial<T>) => T

/**
 * Test fixtures for use when any instance will suffice.
 *
 * i.e. when the assertions in the test aren't dependent on the particulars of the instance.
 */
export namespace Any {
  export const config: New<Config> = () => anyConfig()
  export const configWith: NewWith<Config> = (req) => anyConfigWith(req)

  export const pluginSettings: New<PluginSettings> = () => anyConfig()
  export const pluginSettingsWith: NewWith<PluginSettings> = configWith

  export const parser: New<Parser> = () => Parser.create()
  export const completionGenerator: New<CompletionGenerator> = () =>
    CompletionGenerator.create({ parser: parser() })
  export const completer: New<Completer> = () =>
    Completer.create({
      completionGenerator: completionGenerator(),
    })
  export const lineStyleGenerator: New<LineStyleGenerator> = () => LineStyleGenerator.create()
  export const copyButtonGenerator: New<CopyButtonGenerator> = () =>
    CopyButtonGenerator.create({
      window: FakeWindow.create(),
      clipboard: FakeClipboard.create(),
      config: config(),
    })
  export const opener: New<Opener> = () => Opener.create()
  export const betweenSpacer: New<BetweenSpacer> = () => BetweenSpacer.create()
  export const edgeSpacer: New<EdgeSpacer> = () => EdgeSpacer.create()
  export const requestHandler: New<RequestHandler> = () => RequestHandler.create()
  export const rangeFinder: New<RangeFinder> = () => RangeFinder.create({ parser: parser() })
  export const selectHandler: New<SelectHandler> = () =>
    SelectHandler.create({ rangeFinder: rangeFinder() })
  export const retrier: New<Retrier> = () => Retrier.create({ window: FakeWindow.create() })
}

function anyConfig(): Config {
  return {
    completion: "enabled",
    rendering: "enabled",
    selectAllCapturing: "enabled",
    renderLayout: "minimal",
    cornerStyle: "square",
    excludedLanguages: [],
    copyFormat: "code",
  } as const
}

function anyConfigWith(requiredConfig: Partial<Config>): Config {
  return Dicts.merge(anyConfig(), requiredConfig)
}
