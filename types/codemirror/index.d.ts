import "codemirror"

import { LineHandle } from "codemirror"
import { ReadonlyDeep } from "type-fest"

declare module "codemirror" {
  export interface Doc {
    /**
     * Set a CSS class name for the given line.
     *
     * line can be a number or a line handle.
     * where determines to which element this class should be applied,
     * can be one of
     *  "text" (the text element, which lies in front of the selection),
     *  "background" (a background element that will be behind the selection),
     *  "gutter" (the line's gutter space), or
     *  "wrap" (the wrapper node that wraps all of the line's elements, including gutter elements).
     * class should be the name of the class to apply.
     *
     * This function is missing from the codemirror type definitions.
     *
     * @see https://codemirror.net/5/doc/manual.html#addLineClass
     * @see https://www.npmjs.com/package/@types/codemirror
     */
    addLineClass(
      line: number | LineHandle,
      where: "text" | "background" | "gutter" | "wrap",
      className: string,
    ): LineHandle

    /**
     * Remove a CSS class from a line.
     *
     * line can be a line handle or number.
     * where should be one of
     *   "text",
     *   "background", or
     *   "wrap" (see addLineClass).
     * class can be left off to remove all classes for the specified node,
     * or be a string to remove only a specific class.
     *
     * This function is missing from the codemirror type definitions.
     *
     * @see https://codemirror.net/5/doc/manual.html#removeLineClass
     * @see https://www.npmjs.com/package/@types/codemirror
     */
    removeLineClass(
      line: number | LineHandle,
      where: "text" | "background" | "gutter" | "wrap",
      className: string,
    ): LineHandle
  }

  /**
   * A "readonly" subset of {@link Doc} for better expression of intended use.
   *
   * This does nothing to protect the underlying data, but is more expressive for readability.
   */
  export type ReadonlyDoc = Pick<
    Doc,
    "eachLine" | "getCursor" | "getLine" | "getRange" | "lastLine" | "listSelections"
  >

  /**
   * Passed when a "beforeSelectionChange" event fires.
   *
   * Handler may inspect the set of selection ranges,
   * present as an array of {anchor, head} objects in the ranges property of the obj argument,
   * and optionally change them by calling the update method on this object,
   * passing an array of ranges in the same format.
   *
   * The object also contains an origin property holding the origin string
   * passed to the selection-changing method, if any.
   *
   * Handlers for this have the same restriction as "beforeChange" handlers —
   * they should not do anything to directly update the state of the editor.
   *
   * This refines the type of `EditorSelectionChange` in the codemirror type definitions.
   * That type uses {@link Range} in {@link EditorSelectionChange#update}, but {@link Range} is
   * actually an internal type of codemirror.
   * According to the docs, {@link EditorSelectionChange#update} only wants the external subset of
   * {@link Range} defined in {@link SelectionRange}.
   *
   * @see https://codemirror.net/5/doc/manual.html#event_beforeSelectionChange
   * @see https://www.npmjs.com/package/@types/codemirror
   */
  export interface EditorSelectionChange {
    ranges: Range[]
    update(ranges: SelectionRange[]): void
    origin?: string | undefined
  }

  /**
   * A "readonly" subset of {@link EditorSelectionChange} for better expression of intended use.
   *
   * This does nothing to protect the underlying data, but is more expressive for readability.
   */
  export type ReadonlyEditorSelectionChange = ReadonlyDeep<
    Pick<EditorSelectionChange, "ranges" | "origin">
  >

  /**
   * Describes a range in a {@link Doc}).
   *
   * @see EditorSelectionChange
   */
  export type SelectionRange = Pick<Range, "anchor" | "head">
}
