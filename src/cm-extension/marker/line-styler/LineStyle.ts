import { CodeBlockClass } from "@cm-extension/style/CodeBlockClass"

/**
 * Represents the line classes ({@link background}/{@link text}/{@link wrap}) for a {@link line}.
 *
 * @see https://codemirror.net/5/doc/manual.html#addLineClass
 */
export interface LineStyle {
  readonly line: number

  readonly background?: readonly CodeBlockClass[]
  readonly text?: readonly CodeBlockClass[]
  readonly wrap?: readonly CodeBlockClass[]
}
