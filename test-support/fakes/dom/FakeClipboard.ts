export type FakeClipboard = Clipboard & Extensions
export namespace FakeClipboard {
  export function create(): FakeClipboard {
    return new ExtendedClipboard() as unknown as FakeClipboard
  }
}

type PartialClipboard = Pick<Clipboard, "writeText">

export interface Extensions {
  readonly ext: {
    /**
     * Text written to the clipboard (defaults to "").
     */
    readonly data: string

    /**
     * Clears the clipboard content (resets to "").
     */
    clear(): void
  }
}

// noinspection JSUnusedGlobalSymbols
class ExtendedClipboard implements PartialClipboard, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    data = ""

    clear(): void {
      this.data = ""
    }
  })()

  async writeText(data: string): Promise<void> {
    this.ext.data = data
    return Promise.resolve()
  }
}
