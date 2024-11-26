import { Require } from "@ext/stdlib/Require"

/**
 * Extensions of {@link Iterable}s.
 */
export namespace Iterables {
  /**
   * Returns an {@link Iterable} that yields the integers from
   * {@link start} up to (but not including) {@link endExclusive}.
   *
   * Requires that {@link start} and {@link endExclusive} must be integers and
   * {@link start} must be less than or equal to {@link endExclusive}.
   */
  export function range({
    start,
    endExclusive,
  }: {
    start: number
    endExclusive: number
  }): Iterable<number> {
    Require.integer(start)
    Require.integer(endExclusive)
    Require.validRange({ from: start, to: endExclusive })

    return {
      *[Symbol.iterator](): Generator<number> {
        for (let value = start; value < endExclusive; value++) {
          yield value
        }
      },
    }
  }

  /**
   * Returns an {@link Iterable} that yields nothing.
   *
   * Useful as a placeholder value.
   */
  export function empty<T>(): Iterable<T> {
    return {
      *[Symbol.iterator](): Generator<T> {
        // empty
      },
    }
  }
}
