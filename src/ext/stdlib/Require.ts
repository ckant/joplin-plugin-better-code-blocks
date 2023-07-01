/**
 * Extensions for function requirements / prerequisites.
 */
export namespace Require {
  /**
   * Asserts that {@link number} is an integer.
   */
  export function integer(number: number): void {
    if (!Number.isInteger(number)) throw new Error(`${number} is not an integer`)
  }

  /**
   * Asserts that {@link number} is a non-negative integer.
   */
  export function nonNegativeInteger(number: number): void {
    if (!Number.isInteger(number)) throw new Error(`${number} is not an integer`)
    if (number < 0) throw new Error(`${number} is negative`)
  }

  /**
   * Asserts that {@link from} is less than or equal to {@link to}.
   */
  export function validRange({ from, to }: { from: number; to: number }): void {
    if (from > to) throw new Error(`[${from},${to}] is an invalid range`)
  }

  /**
   * Asserts that {@link array} has exactly one element.
   */
  export function hasSingleElement<T>(array: readonly T[]): void {
    if (array.length === 0) {
      throw new Error(`${array.toString()} is empty`)
    }

    if (array.length > 1) {
      throw new Error(`${array.toString()} has ${array.length} elements`)
    }
  }
}
