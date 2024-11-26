/**
 * Built-in css classes.
 */
export const BuiltInClass = {
  // Tag for the Joplin monospace font (customizable by the user)
  monospace: "cm-jn-monospace",
} as const
export type BuiltInClass = (typeof BuiltInClass)[keyof typeof BuiltInClass]
