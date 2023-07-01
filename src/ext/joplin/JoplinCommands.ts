import ActualJoplinCommands from "api/JoplinCommands"

/**
 * Extensions for `JoplinCommands`.
 */
export namespace JoplinCommands {
  /**
   * Calls the CodeMirror `extension` {@link extensionName} passing {@link arg}.
   *
   * Takes advantage of the `editor.execCommand` Joplin command to call methods on CodeMirror.
   * This works on plugin-defined `extension` methods as well (i.e. methods added
   * by calling {@link CodeMirror#defineExtension}).
   *
   * This enables one-way communication from the Joplin Plugin to the CodeMirror Extension which
   * is normally impossible due to Joplin Plugins running in a separate process.
   *
   * Joplin Plugin APIs provide communication in the reverse direction, from CodeMirror Extension
   * to Joplin Plugin, via {@link ContentScriptContext#postMessage} and {@link JoplinContentScripts#onMessage}.
   *
   * So {@link callCodeMirrorExtension} is to {@link CodeMirror#defineExtension}
   * as {@link ContentScriptContext#postMessage} is to {@link JoplinContentScripts#onMessage}.
   *
   * @see https://codemirror.net/5/doc/manual.html#defineExtension
   * @see https://joplinapp.org/api/references/plugin_api/enums/contentscripttype.html#posting-messages-from-the-content-script-to-your-plugin
   */
  export async function callCodeMirrorExtension(
    joplinCommands: ActualJoplinCommands,
    extensionName: string,
    arg: unknown,
  ): Promise<unknown> {
    return (await joplinCommands.execute("editor.execCommand", {
      name: extensionName,
      args: [arg],
    })) as unknown
  }
}
