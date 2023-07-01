import { Require } from "@ext/stdlib/Require"

/**
 * Extensions for repetition.
 */
export namespace Repeat {
  /**
   * Applies {@link fn} {@link n} times, passing the current {@link i} and returning the results.
   *
   * Basically, the functional equivalent of a simple for-loop that accumulates results.
   * Same as `_.times` in `lodash` / `underscore`.
   *
   * The {@link n} must be a non-negative integer.
   */
  export function times<T>(n: number, fn: (i: number) => T): readonly T[] {
    Require.nonNegativeInteger(n)

    const results = new Array<T>(n)
    for (let i = 0; i < n; i++) {
      results[i] = fn(i)
    }
    return results
  }
}
