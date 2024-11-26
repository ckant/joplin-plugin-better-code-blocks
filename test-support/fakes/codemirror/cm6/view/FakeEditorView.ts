import { Transaction, TransactionSpec } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"

export interface FakeEditorViewProps {
  /**
   * The `EditorState` to set for the view (defaults to a doc with the text `doc`).
   */
  readonly state?: EditorView["state"]

  /**
   * The visible ranges to set (defaults to a single range spanning the entire doc).
   */
  readonly visibleRanges?: EditorView["visibleRanges"]
}

export type FakeEditorView = EditorView & Extensions
export namespace FakeEditorView {
  export function create(props?: FakeEditorViewProps): FakeEditorView {
    return new ExtendedEditorView(props) as unknown as FakeEditorView
  }
}

type PartialEditorView = Pick<EditorView, "dispatch" | "state" | "visibleRanges">

export interface Extensions {
  readonly ext: {
    /**
     * Dispatches made on the {@link EditorView} with {@link EditorView.dispatch}.
     */
    readonly dispatches: readonly (Transaction | TransactionSpec)[]
  }
}

// noinspection JSUnusedGlobalSymbols
class ExtendedEditorView implements PartialEditorView, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    readonly dispatches: (Transaction | TransactionSpec)[] = []
  })()

  readonly state: EditorView["state"]
  readonly visibleRanges: EditorView["visibleRanges"]

  constructor(props?: FakeEditorViewProps) {
    this.state = props?.state ?? InlineState`doc`
    this.visibleRanges = props?.visibleRanges ?? [{ from: 0, to: this.state.doc.length }]
  }

  dispatch(tr: Transaction): void
  dispatch(trs: readonly Transaction[]): void
  dispatch(...specs: TransactionSpec[]): void
  dispatch(
    value: Transaction | readonly Transaction[] | TransactionSpec | TransactionSpec[],
  ): void {
    this.ext.dispatches.push([value].flat()[0])
  }
}
