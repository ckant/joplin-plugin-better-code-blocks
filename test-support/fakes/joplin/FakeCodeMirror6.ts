import { CodeMirror6 } from "api/types"
import { Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

import { FakeEditorView } from "test-support/fakes/codemirror/cm6/view/FakeEditorView"
import { FakeJoplinExtensions } from "test-support/fakes/joplin/FakeJoplinExtensions"

export type FakeCodeMirror6 = CodeMirror6 & Extensions
export namespace FakeCodeMirror6 {
  export function create(): FakeCodeMirror6 {
    return new ExtendedCodeMirror6() as unknown as FakeCodeMirror6
  }
}

type PartialCodeMirror6 = Pick<CodeMirror6, "cm6" | "addExtension"> & {
  joplinExtensions: FakeJoplinExtensions
}

export interface Extensions {
  readonly ext: {
    /**
     * The extension sent in {@link CodeMirror#addExtension} (if called).
     */
    readonly extension: Extension | undefined
  }
}

// noinspection JSUnusedGlobalSymbols
class ExtendedCodeMirror6 implements PartialCodeMirror6, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    extension: Extension | undefined
  })()

  readonly joplinExtensions: FakeJoplinExtensions = FakeJoplinExtensions.create()

  get cm6(): EditorView {
    return FakeEditorView.create()
  }

  addExtension(extension: Extension): void {
    this.ext.extension = extension
  }
}
