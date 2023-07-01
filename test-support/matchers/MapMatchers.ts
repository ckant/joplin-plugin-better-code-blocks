import { MatchersObject, MatcherState } from "@vitest/expect"

import { strictEquals } from "test-support/matchers/common"

/**
 * Matchers for {@link Map}s.
 */
export const MapMatchers: MatchersObject = {
  /**
   * Matches an {@link actual} {@link Map} that contains exactly the given {@link key}-{@link value} pair.
   */
  toContainExactlyEntry(
    this: MatcherState,
    actual: Map<unknown, unknown>,
    key: unknown,
    value: unknown,
  ) {
    const equals = strictEquals(this)
    const expected = new Map([[key, value]])

    return {
      pass: equals(expected, actual),
      message: () =>
        `Expected Map to ${this.isNot ? "not " : ""}contain exactly the given (key, value) pair`,
      expected: this.utils.stringify(expected),
      actual: this.utils.stringify(actual),
    }
  },
}
