/**
 * Font-Awesome CSS classes.
 */
export const FontAwesomeClass = {
  solid: "fa-solid",
  clipboard: "fa-clipboard",
  clipboardCheck: "fa-clipboard-check",
} as const
export type FontAwesomeClass = (typeof FontAwesomeClass)[keyof typeof FontAwesomeClass]
