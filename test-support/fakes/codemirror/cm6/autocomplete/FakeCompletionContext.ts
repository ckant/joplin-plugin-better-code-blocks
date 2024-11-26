import { CompletionContext } from "@codemirror/autocomplete"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

export interface FakeCompletionContextProps {
  /**
   * The `EditorState` to set for the context (defaults to a doc with the text `doc`)
   */
  readonly state?: CompletionContext["state"]

  /**
   * The position of the cursor (defaults to the start of the doc).
   */
  readonly pos?: CompletionContext["pos"]
}

export type FakeCompletionContext = CompletionContext & Extensions
export namespace FakeCompletionContext {
  export function create(props?: FakeCompletionContextProps): FakeCompletionContext {
    return new ExtendedCompletionContext(props) as unknown as FakeCompletionContext
  }
}

type PartialCompletionContext = Pick<CompletionContext, "pos" | "state">

export interface Extensions {
  readonly ext: object
}

// noinspection JSUnusedGlobalSymbols
class ExtendedCompletionContext implements PartialCompletionContext, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {})()

  readonly state: CompletionContext["state"]
  readonly pos: CompletionContext["pos"]

  constructor(props?: FakeCompletionContextProps) {
    this.state = props?.state ?? InlineState`doc`
    this.pos = props?.pos ?? 0
  }
}
