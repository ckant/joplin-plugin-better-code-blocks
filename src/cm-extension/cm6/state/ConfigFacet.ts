import { Facets } from "@ext/codemirror/cm6/state/Facets"
import { SingularFacetSpec } from "@ext/codemirror/cm6/state/SingularFacet"

import { Config } from "@cm-extension/cm6/model/Config"

/**
 * {@link SingularFacetSpec} for a {@link SingularFacet} that stores a {@link Config}.
 */
export const ConfigFacetSpec: SingularFacetSpec<Config> = { defaultValue: Config.createDefault }

/**
 * {@link SingularFacet} that stores a {@link Config}.
 */
export const ConfigFacet = Facets.defineSingular(ConfigFacetSpec)
