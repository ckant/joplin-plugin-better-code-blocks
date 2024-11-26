/**
 * User events defined by CodeMirror.
 *
 * @see https://codemirror.net/docs/ref/#state.Transaction%5EuserEvent
 */
export const UserEvent = {
  // Backspace key press
  deleteBackward: "delete.backward",

  // Delete key press
  deleteForward: "delete.forward",
} as const
export type UserEvent = (typeof UserEvent)[keyof typeof UserEvent]
