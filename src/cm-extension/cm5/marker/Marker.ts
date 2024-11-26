import { Doc } from "codemirror"

import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"

/**
 * Augments {@link Doc}s with marks and styles (e.g. line classes).
 */
export interface Marker {
  /**
   * Marks the given {@link codeBlocks} in {@link doc}.
   *
   * e.g. adding line classes to lines within {@link codeBlocks}.
   */
  mark(doc: Doc, codeBlocks: readonly CodeBlock[]): void
}
export namespace Marker {
  /**
   * Adapts multiple {@link markers} into a single {@link Marker} (applied first to last).
   */
  export function combine(...markers: readonly Marker[]): Marker {
    return {
      mark(doc: Doc, codeBlocks: readonly CodeBlock[]): void {
        markers.forEach((it) => it.mark(doc, codeBlocks))
      },
    }
  }
}
