import { Editor } from "codemirror"

import { Completer } from "@cm-extension/completer/Completer"
import { Origin } from "@cm-extension/model/Origin"

export interface CompleteHandlerProps {
  readonly completer: Completer
}

/**
 * Handles autocompletion of code fences using the given {@link completer}.
 */
export class CompleteHandler {
  private readonly completer: Completer

  static create(props: CompleteHandlerProps): CompleteHandler {
    return new CompleteHandler(props)
  }

  private constructor(props: CompleteHandlerProps) {
    this.completer = props.completer
  }

  /**
   * Completes an incomplete code fence if one exists at the {@link cm} {@link Doc} cursor position
   * and {@link keyboardEvent} is due to an `Enter` press.
   *
   * The operation executes using {@link Origin#CompleteHandler}.
   *
   * If the completion succeeds, calls {@link KeyboardEvent#preventDefault} to cut off handling
   * downstream.
   */
  completeOnEnter(cm: Editor, keyboardEvent: KeyboardEvent): void {
    if (keyboardEvent.code !== "Enter") return

    const completed = cm.operation(() =>
      this.completer.complete(cm.getDoc(), Origin.CompleteHandler),
    )
    if (completed) keyboardEvent.preventDefault()
  }
}
