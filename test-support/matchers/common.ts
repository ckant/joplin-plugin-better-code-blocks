import { MatcherState } from "@vitest/expect"

/**
 * Shortcut for checking strict equality using {@link MatcherState}.
 */
export function strictEquals(matcherState: MatcherState): (a: unknown, b: unknown) => boolean {
  return (a, b) => matcherState.equals(a, b, [matcherState.utils.iterableEquality], true)
}
