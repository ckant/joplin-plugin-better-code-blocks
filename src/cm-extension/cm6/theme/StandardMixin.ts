import { ThemeSpec } from "@codemirror/view"

const SquareMixin: ThemeSpec = {
  // Opening fence line with square top corners
  "&[data-cb-render-layout='standard'][data-cb-corner-style='square'] .cb-start-line": {
    "border-top-left-radius": 0,
    "border-top-right-radius": 0,
  },

  // Closing fence line with square bottom corners
  "&[data-cb-render-layout='standard'][data-cb-corner-style='square'] .cb-end-line": {
    "border-bottom-right-radius": 0,
    "border-bottom-left-radius": 0,
  },
}

/**
 * Mixin that adds styles specific to the standard layout.
 */
export const StandardMixin: ThemeSpec = {
  ...SquareMixin,

  // Button inside opening fence widget that copies the code
  "&[data-cb-render-layout='standard'] .cb-copy-btn": {
    padding: "0 0.25ch",
  },

  // Text inside closing fence widget that shows the language
  "&[data-cb-render-layout='standard'] .cb-lang": {
    visibility: "hidden",
  },
}
