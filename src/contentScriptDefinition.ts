/**
 * Bootstrap for defining the Code Mirror content script.
 *
 * This exists in the top-level `src` directory because content script assets
 * must either be in the content script's directory or a subdirectory.
 *
 * However, the content script is in `./content-script` and the assets are in `./cm-extension`.
 * These two separate directories exist to (physically) decouple the standalone Code Mirror extension
 * from the Joplin content script.
 *
 * This file bridges the content script with the relative references to the CM extension assets.
 */

import { CmContentScriptDefinition, PostMessageHandler } from "api/types"

import { Retrier } from "@ext/stdlib/Retrier"

import { JoplinPluginClient } from "@joplin-plugin-ipc/JoplinPluginClient"

import { ContentScript } from "@content-script/ContentScript"

import { CmExtensions } from "@cm-extension/CmExtensions"
import { Config } from "@cm-extension/model/Config"

/**
 * Calls the Joplin plugin with inter-process communication via {@link postMessage}.
 *
 * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#codemirrorplugin
 */
async function getConfig(postMessage: PostMessageHandler): Promise<Config> {
  const retrier = Retrier.create({ window })
  const client = JoplinPluginClient.create({ call: postMessage, retrier })
  return await client.getSettings()
}

const contentScriptDefinition: CmContentScriptDefinition = (contentScriptContext) => {
  return ContentScript.create({
    createCmExtension: async (codeMirror, editor) => {
      const config = await getConfig(contentScriptContext.postMessage)
      return CmExtensions.createDefault({ codeMirror, editor, config })
    },
    // Assets must be within the (current) file's directory or a subdirectory for Joplin to load them
    styles: [
      "./cm-extension/assets/cm-extension.css",
      "./cm-extension/assets/opt/render-layout/minimal.css",
      "./cm-extension/assets/opt/render-layout/standard.css",
    ],
  })
}

// noinspection JSUnusedGlobalSymbols
/**
 * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#codemirrorplugin
 */
export default contentScriptDefinition
