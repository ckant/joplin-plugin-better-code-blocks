import JoplinContentScripts from "api/JoplinContentScripts"
import JoplinPlugins from "api/JoplinPlugins"
import JoplinSettings, { ChangeHandler } from "api/JoplinSettings"
import { ContentScriptType, ExtendedSettingSection } from "api/types"

import { JoplinSettings as JoplinSettingsExt } from "@ext/joplin/JoplinSettings"

import { CmExtensionClient } from "@cm-extension-ipc/CmExtensionClient"
import { PluginRequestHandler } from "@joplin-plugin-ipc/model/handler"

import { RequestHandler } from "@joplin-plugin/handler/RequestHandler"

export interface JoplinPluginProps<Settings> {
  readonly cmExtensionClient: CmExtensionClient
  readonly contentScript: {
    readonly id: string
    readonly path: string
  }
  readonly joplin: {
    readonly contentScripts: JoplinContentScripts
    readonly plugins: JoplinPlugins
    readonly settings: JoplinSettings
  }
  readonly requestHandler: RequestHandler
  readonly settingSection: ExtendedSettingSection<Settings>
}

/**
 * The {@link pluginName} Joplin plugin.
 *
 * - Registers {@link settingSection} in {@link joplin#settings}.
 * - Registers Code Mirror {@link contentScript} in {@link joplin#contentScripts}.
 * - Registers Joplin plugin {@link requestHandler} to handle messages from {@link contentScript}.
 * - Registers {@link cmExtensionClient} as change listener for Joplin plugin settings.
 */
export namespace JoplinPlugin {
  export const pluginName = "BetterCodeBlocks"

  export async function register<Settings>({
    cmExtensionClient,
    contentScript,
    joplin,
    requestHandler,
    settingSection,
  }: JoplinPluginProps<Settings>): Promise<void> {
    return await joplin.plugins.register({
      onStart: async () => {
        await JoplinSettingsExt.register(joplin.settings, pluginName, settingSection)
        await joplin.contentScripts.register(
          ContentScriptType.CodeMirrorPlugin,
          contentScript.id,
          contentScript.path,
        )
        await joplin.contentScripts.onMessage(contentScript.id, messageHandler(requestHandler))
        await joplin.settings.onChange(settingsChangeHandler(cmExtensionClient))
      },
    })
  }
}

function messageHandler(requestHandler: RequestHandler): PluginRequestHandler {
  return (request) => requestHandler.handle(request)
}

function settingsChangeHandler(cmExtensionClient: CmExtensionClient): ChangeHandler {
  // Perform a no-op since CM extension is completely re-initialized when settings change
  return () => void (async () => await cmExtensionClient.ping())()
}
