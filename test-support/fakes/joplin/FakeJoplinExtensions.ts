import { CodeMirror6 } from "api/types"
import { CompletionSource } from "@codemirror/autocomplete"
import { Extension } from "@codemirror/state"

export type FakeJoplinExtensions = CodeMirror6["joplinExtensions"] & Extensions
export namespace FakeJoplinExtensions {
  export function create(): FakeJoplinExtensions {
    return new ExtendedJoplinExtensions() as unknown as FakeJoplinExtensions
  }
}

type PartialJoplinExtensions = Pick<CodeMirror6["joplinExtensions"], "completionSource">

export interface Extensions {
  readonly ext: {
    /**
     * The source sent in {@link CodeMirror6#joplinExtensions.completionSource} (if called).
     */
    readonly completionSource: CompletionSource | undefined
  }
}

// noinspection JSUnusedGlobalSymbols
class ExtendedJoplinExtensions implements PartialJoplinExtensions, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    completionSource: CompletionSource | undefined
  })()

  completionSource(completionSource: CompletionSource): Extension {
    this.ext.completionSource = completionSource

    return undefined as unknown as Extension
  }
}
