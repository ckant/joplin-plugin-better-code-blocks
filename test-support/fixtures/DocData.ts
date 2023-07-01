import { Data } from "test-support/data/docs/Data"

/**
 * Pre-defined {@link Doc}s along with their data.
 */
export namespace DocData {
  /**
   * Basic {@link Doc}s for use when any will suffice.
   */
  export namespace Any {
    // language=file-reference
    export const simple = Data.single("/test-support/data/docs/any/simple.md")

    // language=file-reference
    export const combo = Data.multiple("/test-support/data/docs/any/combo.md")
  }

  /**
   * Set of {@link Doc}s that have invalid {@link CodeBlock}s.
   */
  export namespace Invalid {
    // language=file-reference
    export const unclosed = Data.invalid("/test-support/data/docs/invalid/unclosed.md")

    // language=file-reference
    export const nested = Data.invalid("/test-support/data/docs/invalid/nested.md")
  }

  /**
   * Set of {@link Doc}s that contain a mixture of {@link CodeBlock}s.
   */
  export namespace Mixed {
    // language=file-reference
    export const combo = Data.multiple("/test-support/data/docs/mixed/combo.md")
  }

  /**
   * Set of {@link Doc}s that contain no {@link CodeBlock}s.
   */
  export namespace None {
    // language=file-reference
    export const empty = Data.none("/test-support/data/docs/none/empty.md")

    // language=file-reference
    export const nonempty = Data.none("/test-support/data/docs/none/nonempty.md")
  }

  /**
   * Set of {@link Doc}s that contain opened {@link CodeBlock}s.
   *
   * @see Opener
   */
  export namespace Opened {
    // language=file-reference
    export const combo = Data.multiple("/test-support/data/docs/opened/combo.md")
  }

  /**
   * Set of {@link Doc}s that contain spaced {@link CodeBlock}s.
   *
   * @see Spacer
   */
  export namespace Spaced {
    // language=file-reference
    export const simple = Data.single("/test-support/data/docs/spaced/simple.md")

    // language=file-reference
    export const combo = Data.multiple("/test-support/data/docs/spaced/combo.md")
  }

  /**
   * Set of {@link Doc}s that contain unopened {@link CodeBlock}s.
   *
   * @see Opener
   */
  export namespace Unopened {
    // language=file-reference
    export const combo = Data.multiple("/test-support/data/docs/unopened/combo.md")
  }

  /**
   * Set of {@link Doc}s that contain unspaced {@link CodeBlock}s.
   *
   * @see Spacer
   */
  export namespace Unspaced {
    // language=file-reference
    export const simple = Data.single("/test-support/data/docs/unspaced/simple.md")

    // language=file-reference
    export const combo = Data.multiple("/test-support/data/docs/unspaced/combo.md")
  }
}
