import { ThemeSpec } from "@codemirror/view"

import { MinimalMixin } from "@cm-extension/cm6/theme/MinimalMixin"
import { StandardMixin } from "@cm-extension/cm6/theme/StandardMixin"

/**
 * Base theme that defines styles for code fences.
 *
 * @see EditorView.baseTheme
 */
export const Theme: ThemeSpec = {
  ...MinimalMixin,
  ...StandardMixin,

  // All lines of the code block
  "&.cm-editor .cm-codeBlock": {
    "border-width": 0,
    "padding-right": 0,
  },

  // Opening and closing fence widgets
  "& .cb-start-widget, & .cb-end-widget": {
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "space-between",
    width: "100%",
  },

  // Opening and closing fence content
  "& .cb-opening-fence, & .cb-closing-fence": {
    color: "var(--joplin-color-faded)",
    "-webkitFontSmoothing": "antialiased",
    "user-select": "none",
  },

  // Button inside start widget that copies the code
  "& .cb-copy-btn": {
    cursor: "pointer",
    background: "none",
    border: "none",
    opacity: 0,
    transition: "opacity 0.5s ease-in-out 0s",
  },

  "& .cb-copy-btn:hover": {
    opacity: 1,
  },

  // Copy button click transition state
  "& .cb-copy-btn.cb-copied": {
    opacity: 1,
  },

  // Font Awesome icon inside the copy button
  "& .cb-copy-btn .fa-solid": {
    "font-family": '"Font Awesome 5 Free"',
    "font-size": "2.5ch",
    "font-style": "normal",
    "font-weight": 900,
    "line-height": 1,
    color: "var(--joplin-color-faded)",
    "-webkitFontSmoothing": "antialiased",
  },

  // Text inside closing fence widget that shows the language
  "& .cb-lang": {
    color: "var(--joplin-color-faded)",
    "-webkitFontSmoothing": "antialiased",
    "user-select": "none",
  },
}
