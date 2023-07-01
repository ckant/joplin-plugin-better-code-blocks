/**
 * Main entry-point for the Joplin plugin.
 *
 * Joplin imports this file to register the plugin (i.e. importing this file has the side effect
 * of registering the plugin).
 */

import joplin from "api"

import { JoplinCommands } from "@ext/joplin/JoplinCommands"

import { CmExtensionClient } from "@cm-extension-ipc/CmExtensionClient"
import { CmExtensionRequestHandler } from "@cm-extension-ipc/model/handler"

import { RequestHandler } from "@joplin-plugin/handler/RequestHandler"
import { JoplinPlugin } from "@joplin-plugin/JoplinPlugin"
import { PluginSettings } from "@joplin-plugin/settings/PluginSettings"
import { PluginSettingSection } from "@joplin-plugin/settings/PluginSettingSection"
import { PluginSettingsProvider } from "@joplin-plugin/settings/PluginSettingsProvider"

/**
 * Calls the Code Mirror extension with inter-process communication triggered by `editor.execCommand`.
 *
 * @see callCodeMirrorExtension
 */
const requestHandler: CmExtensionRequestHandler = ((arg) =>
  JoplinCommands.callCodeMirrorExtension(
    joplin.commands,
    JoplinPlugin.pluginName,
    arg,
  )) as CmExtensionRequestHandler

function registerPlugin(): void {
  void JoplinPlugin.register<PluginSettings>({
    cmExtensionClient: CmExtensionClient.create({ call: requestHandler }),
    contentScript: {
      id: JoplinPlugin.pluginName,
      path: "./contentScriptDefinition.js",
    },
    joplin: {
      contentScripts: joplin.contentScripts,
      plugins: joplin.plugins,
      settings: joplin.settings,
    },
    requestHandler: RequestHandler.create({
      pluginSettingsProvider: PluginSettingsProvider.create({ joplinSettings: joplin.settings }),
    }),
    settingSection: PluginSettingSection,
  })
}

registerPlugin()
