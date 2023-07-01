import CodeMirror, { Editor } from "codemirror"

export type FakeCodeMirror = typeof CodeMirror & Extensions
export namespace FakeCodeMirror {
  export function create(): FakeCodeMirror {
    return new ExtendedCodeMirror() as unknown as FakeCodeMirror
  }
}

type PartialCodeMirror = Pick<typeof CodeMirror, "defineExtension" | "defineOption">

export interface Extensions {
  readonly ext: {
    /**
     * The extension sent in {@link CodeMirror#defineExtension} (if called).
     */
    readonly extension: CodeMirrorExtension | undefined

    /**
     * The option sent in {@link CodeMirror#defineOption} (if called).
     */
    readonly option: CodeMirrorOption | undefined
  }
}

/**
 * Represents the parameters of call to {@link CodeMirror#defineExtension}.
 */
export interface CodeMirrorExtension {
  name: string
  value: unknown
}

/**
 * Represents the parameters of a call to {@link CodeMirror#defineOption}.
 */
export interface CodeMirrorOption {
  name: string
  default_: unknown
  updateFunc: (editor: Editor, val: unknown, old: unknown) => void
}

// noinspection JSUnusedGlobalSymbols
class ExtendedCodeMirror implements PartialCodeMirror, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    extension: CodeMirrorExtension | undefined
    option: CodeMirrorOption | undefined
  })()

  defineExtension(name: string, value: unknown): void {
    this.ext.extension = { name, value }
  }

  defineOption: typeof CodeMirror.defineOption = (name, default_: unknown, updateFunc) => {
    this.ext.option = { name, default_, updateFunc }
  }
}
