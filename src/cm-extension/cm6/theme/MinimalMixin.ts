import { ThemeSpec } from "@codemirror/view"

const RoundMixin: ThemeSpec = {
  // First code line with round top corners
  "&[data-cb-render-layout='minimal'][data-cb-corner-style='round'] .cb-code-line.cb-first": {
    "border-top-left-radius": "3px",
    "border-top-right-radius": "3px",
  },

  // Last code line with round bottom corners
  "&[data-cb-render-layout='minimal'][data-cb-corner-style='round'] .cb-code-line.cb-last": {
    "border-bottom-right-radius": "3px",
    "border-bottom-left-radius": "3px",
  },
}

/**
 * Mixin that adds styles specific to the minimal layout.
 */
export const MinimalMixin: ThemeSpec = {
  ...RoundMixin,

  // Opening and closing code fences
  "&[data-cb-render-layout='minimal'] .cb-start-line, &[data-cb-render-layout='minimal'] .cb-end-line":
    {
      position: "relative",
      background: "none",
    },

  // Opening and closing fence content
  "&[data-cb-render-layout='minimal'] .cb-opening-fence, &[data-cb-render-layout='minimal'] .cb-closing-fence":
    {
      visibility: "hidden",
    },

  // Button inside start widget that copies the code
  "&[data-cb-render-layout='minimal'] .cb-copy-btn": {
    // Lower the button onto the rightmost edge of the first code line
    position: "absolute",
    top: "100%",
    right: 0,
    height: "100%",
    padding: "0 0.25ch",
  },
}
