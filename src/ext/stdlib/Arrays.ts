import { def } from "@ext/stdlib/existence"
import { Require } from "@ext/stdlib/Require"

/**
 * Extensions for `Array`s.
 */
export namespace Arrays {
  /**
   * Returns a copy of {@link array} with `null` and `undefined` values filtered out.
   *
   * Similar to Ruby's `Array.compact`
   * @see https://ruby-doc.org/3.2.2/Array.html#method-i-compact
   */
  export function compact<T>(array: readonly T[]): readonly NonNullable<T>[] {
    return array.filter((it) => {
      return def(it)
    }) as NonNullable<T>[]
  }

  /**
   * Returns the only element in an {@link array}.
   *
   * The {@link array} must contain exactly 1 element.
   */
  export function onlyElement<T>(array: readonly T[]): T {
    Require.hasSingleElement(array)

    return array[0]!
  }
}
