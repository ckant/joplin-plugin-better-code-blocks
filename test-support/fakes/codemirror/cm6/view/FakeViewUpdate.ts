import { ViewUpdate } from "@codemirror/view"

import { InlineState } from "test-support/ext/codemirror/cm6/InlineState"
import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"

export interface FakeViewUpdateProps {
  /**
   * Whether the doc changed in the {@link ViewUpdate}.
   */
  readonly docChanged?: ViewUpdate["docChanged"]

  /**
   * Whether the viewport changed in the {@link ViewUpdate}.
   */
  readonly viewportChanged?: ViewUpdate["viewportChanged"]

  /**
   * The `EditorView` to set in the {@link ViewUpdate}.
   */
  readonly view?: ViewUpdate["view"]

  /**
   * The `EditorState` to set in the {@link ViewUpdate}.
   */
  readonly state?: ViewUpdate["state"]
}

export type FakeViewUpdate = ViewUpdate & Extensions
export namespace FakeViewUpdate {
  export function create(props?: FakeViewUpdateProps): FakeViewUpdate {
    return new ExtendedViewUpdate(props) as unknown as FakeViewUpdate
  }
}

type PartialViewUpdate = Pick<ViewUpdate, "docChanged" | "state" | "view" | "viewportChanged">

export interface Extensions {
  readonly ext: object
}

// noinspection JSUnusedGlobalSymbols
class ExtendedViewUpdate implements PartialViewUpdate, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {})()

  readonly docChanged: ViewUpdate["docChanged"]
  readonly state: ViewUpdate["state"]
  readonly view: ViewUpdate["view"]
  readonly viewportChanged: ViewUpdate["viewportChanged"]

  constructor(props?: FakeViewUpdateProps) {
    this.docChanged = props?.docChanged ?? false
    this.viewportChanged = props?.viewportChanged ?? false
    this.state = props?.state ?? InlineState`^doc`
    this.view = props?.view ?? FakeEditorView.create({ state: this.state })
  }
}
