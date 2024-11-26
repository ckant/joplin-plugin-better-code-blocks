import { Facet, FacetSpec } from "@codemirror/state"

/**
 * Config for a {@link SingularFacet}.
 *
 * Simplification of a {@link FacetSpec} that defines a `defaultValue` rather than
 * way to `combine` multiple values.
 */
export type SingularFacetSpec<T> = { defaultValue(): T } & Omit<FacetSpec<T, T>, "combine">

/**
 * A {@link Facet} that has a singular input and output.
 */
export type SingularFacet<T> = Facet<T, T>
