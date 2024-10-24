import { EditorSelectionChange, ReadonlyDoc } from "codemirror"

import { Docs } from "@ext/codemirror/Docs"
import { Events } from "@ext/codemirror/Events"
import { nil } from "@ext/stdlib/existence"

import { RangeFinder } from "@cm-extension/RangeFinder"

export interface SelectHandlerProps {
  readonly rangeFinder: RangeFinder
}

/**
 * Handles selection of code fences using the given {@link rangeFinder}.
 */
export class SelectHandler {
  private readonly rangeFinder: RangeFinder

  static create(props: SelectHandlerProps): SelectHandler {
    return new SelectHandler(props)
  }

  private constructor(props: SelectHandlerProps) {
    this.rangeFinder = props.rangeFinder
  }

  /**
   * Selects the code within a code fence if the {@link doc} cursor is inside the code fence
   * and the {@link change} is due to a `Select All` action.
   *
   * This "captures" the `Select All` action to simplify code fence selection.
   *
   * If the code fence is already selected, lets the `Select All` go through unchanged.
   * This allows the user to perform `Select All` twice to perform a true `Select All` action.
   */
  selectOnSelectAll(doc: ReadonlyDoc, change: EditorSelectionChange): void {
    if (!Events.isSelectAll(doc, change)) return

    const codeRange = this.rangeFinder.findActiveCodeRange(doc)
    if (nil(codeRange) || Docs.isSelected(doc, codeRange)) return

    change.update([{ anchor: codeRange.from, head: codeRange.to }])
  }
}
