import { Position } from "codemirror"

import { Positions } from "@ext/codemirror/Positions"

export interface RangeProps {
  readonly from: Position
  readonly to: Position
}

/**
 * Represents a range [{@link from},{@link to}] within a {@link Doc}.
 */
export class Range {
  readonly from: Position
  readonly to: Position

  static of(props: RangeProps): Range {
    return new Range(props)
  }

  private constructor({ from, to }: RangeProps) {
    this.from = from
    this.to = to
  }

  /**
   * Returns true if `this` deeply equals {@link other}.
   */
  equals(other: Range): boolean {
    return Positions.areEqual(this.from, other.from) && Positions.areEqual(this.to, other.to)
  }
}
