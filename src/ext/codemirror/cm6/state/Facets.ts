import { Facet } from "@codemirror/state"
import { Arrays, Dicts } from "@ts-belt"

import { SingularFacet, SingularFacetSpec } from "@ext/codemirror/cm6/state/SingularFacet"

/**
 * Operations on {@link Facet}s.
 */
export namespace Facets {
  /**
   * Defines a {@link Facet} that should always have exactly one value.
   *
   * Note that all Facets must specify a default value for cases where a value
   * for the Facet is never actually assigned, even if that shouldn't ordinarily be the case.
   */
  export function defineSingular<T>(spec: SingularFacetSpec<T>): SingularFacet<T> {
    return Facet.define({
      ...Dicts.deleteKey(spec, "defaultValue"),

      /**
       * Returns the `defaultValue` when the Facet is first defined, otherwise
       * returns the first of the provided {@link values}.
       *
       * Note that singular Facets can't the default implementation of `combine`.
       * This is because Facets, by default, return `T[]` instead of `T`,
       * despite what the return type on the method would suggest.
       *
       * Leaving `combine` unimplemented here would return `[]` on create,
       * followed by `[T]` on assignment.
       * This implementation always returns `T` (no tuples/arrays).
       */
      combine(values: readonly T[]): T {
        return Arrays.isEmpty(values) ? spec.defaultValue() : Arrays.head(values)!
      },
    })
  }
}
