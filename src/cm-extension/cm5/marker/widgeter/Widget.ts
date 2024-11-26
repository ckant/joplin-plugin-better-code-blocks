import { LineSegment } from "@ext/codemirror/cm5/LineSegment"

/**
 * Represents an {@link element} that replaces the content of a {@link range} of text.
 *
 * @see https://codemirror.net/5/doc/manual.html#markText
 */
export interface Widget {
  readonly element: HTMLElement
  readonly range: LineSegment
}
