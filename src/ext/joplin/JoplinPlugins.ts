import { CodeMirror5, CodeMirror6 } from "api/types"

/**
 * Extensions for `JoplinSettings`.
 */
export namespace JoplinPlugins {
  /**
   * Type guard that returns whether a {@link codeMirror} is {@link CodeMirror6}.
   *
   * @see https://joplinapp.org/help/api/tutorials/cm6_plugin#codemirror-5-compatibility
   */
  export function isCodeMirror6(codeMirror: CodeMirror5 | CodeMirror6): codeMirror is CodeMirror6 {
    return "cm6" in codeMirror
  }
}
