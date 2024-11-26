import { ReadonlyDoc, ReadonlyEditorSelectionChange } from "codemirror"

/**
 * Extensions for {@link CodeMirror} Events.
 */
export namespace Events {
  /**
   * Returns true if the {@link selectionChange} within the {@link doc} represents a `Select All`.
   */
  export function isSelectAll(
    doc: ReadonlyDoc,
    selectionChange: ReadonlyEditorSelectionChange,
  ): boolean {
    if (selectionChange.ranges?.length !== 1) return false

    const [{ anchor: from, head: to }] = selectionChange.ranges
    if (from.line > 0 || from.ch > 0) return false

    const lastLine = doc.lastLine()
    return to.line === lastLine && to.ch === doc.getLine(lastLine).length
  }
}
