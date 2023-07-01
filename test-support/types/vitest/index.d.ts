// noinspection JSUnusedGlobalSymbols

import "vitest"

declare module "vitest" {
  /**
   * Extend vitest matchers.
   *
   * @see https://vitest.dev/guide/extending-matchers.html
   */
  interface Assertion<T> {
    toContainExactlyEntry(key: unknown, value: unknown): T
    toContainExactlyItem(value: unknown): T
  }

  /**
   * Extend vitest matchers.
   *
   * @see https://vitest.dev/guide/extending-matchers.html
   */
  interface AsymmetricMatchersContaining {
    toContainExactlyEntry(key: unknown, value: unknown): Map<unknown, unknown>
    toContainExactlyItem(value: unknown): Set<unknown>
  }
}
