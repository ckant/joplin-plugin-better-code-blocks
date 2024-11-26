/**
 * Completion types defined by CodeMirror.
 *
 * @see https://codemirror.net/docs/ref/#autocomplete.Completion.type
 */
export const CompletionType = {
  // Completion of a type definition
  type: "type",
} as const
export type CompletionType = (typeof CompletionType)[keyof typeof CompletionType]
