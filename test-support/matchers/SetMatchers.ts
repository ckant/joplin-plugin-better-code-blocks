import { MatchersObject, MatcherState } from "@vitest/expect"

import { strictEquals } from "test-support/matchers/common"

/**
 * Matchers for {@link Set}s.
 */
export const SetMatchers: MatchersObject = {
  /**
   * Matches an {@link actual} {@link Set} that contains exactly the given {@link item}.
   */
  toContainExactlyItem(this: MatcherState, actual: Set<unknown>, item: unknown) {
    const equals = strictEquals(this)
    const expected = new Set([item])

    return {
      pass: equals(expected, actual),
      message: () => `Expected Set to ${this.isNot ? "not " : ""}contain exactly the given item`,
      expected: this.utils.stringify(expected),
      actual: this.utils.stringify(actual),
    }
  },
}
