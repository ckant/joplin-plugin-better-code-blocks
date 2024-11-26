import { Arrays } from "@ts-belt"

import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"

/**
 * Operations on multiple {@link CodeBlock}s.
 */
export namespace CodeBlocks {
  /**
   * Returns true if {@link first} is deeply equal to {@link second}.
   */
  export function areEqual(first: readonly CodeBlock[], second: readonly CodeBlock[]): boolean {
    return Arrays.eq(first, second, (firstCb, secondCb) => firstCb.equals(secondCb))
  }
}
