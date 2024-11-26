import { CodeMirror5 } from "api/types"
import CodeMirror, { Editor } from "codemirror"

export type FakeCodeMirror5 = CodeMirror5 & Extensions
export namespace FakeCodeMirror5 {
  export function create(): FakeCodeMirror5 {
    return new ExtendedCodeMirror5() as unknown as FakeCodeMirror5
  }
}

type PartialCodeMirror5 = Pick<CodeMirror5, "defineExtension" | "defineOption">

export interface Extensions {
  readonly ext: {
    /**
     * The extension sent in {@link CodeMirror#defineExtension} (if called).
     */
    readonly extension: CodeMirror5Extension | undefined

    /**
     * The option sent in {@link CodeMirror#defineOption} (if called).
     */
    readonly option: CodeMirror5Option | undefined
  }
}

/**
 * Represents the parameters of call to {@link CodeMirror#defineExtension}.
 */
export interface CodeMirror5Extension {
  name: string
  value: unknown
}

/**
 * Represents the parameters of a call to {@link CodeMirror#defineOption}.
 */
export interface CodeMirror5Option {
  name: string
  default_: unknown
  updateFunc: (editor: Editor, val: unknown, old: unknown) => void
}

// noinspection JSUnusedGlobalSymbols
class ExtendedCodeMirror5 implements PartialCodeMirror5, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    extension: CodeMirror5Extension | undefined
    option: CodeMirror5Option | undefined
  })()

  defineExtension(name: string, value: unknown): void {
    this.ext.extension = { name, value }
  }

  defineOption: typeof CodeMirror.defineOption = (name, default_: unknown, updateFunc) => {
    this.ext.option = { name, default_, updateFunc }
  }
}
