import { Position } from "codemirror"

/**
 * Extensions for {@link Position}s.
 */
export namespace Positions {
  /**
   * Returns true if {@link first} is deeply equal to {@link second}.
   */
  export function areEqual(first: Position, second: Position): boolean {
    return first.line === second.line && first.ch === second.ch
  }

  /**
   * Returns true if {@link before} comes strictly before {@link after}.
   */
  export function areStrictlyOrdered({
    before,
    after,
  }: {
    before: Position
    after: Position
  }): boolean {
    if (before.line < after.line) return true
    if (before.line > after.line) return false

    return before.ch < after.ch
  }
}
