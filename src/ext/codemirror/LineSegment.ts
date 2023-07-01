import { Position } from "codemirror"

import { Require } from "@ext/stdlib/Require"

export interface LineSegmentProps {
  readonly line: number
  readonly from: number
  readonly to: number
}

/**
 * Represents a contiguous part of a given {@link line} [{@link from},{@link to}].
 *
 * The {@link line}, {@link from}, and {@link to} must be non-negative integers.
 * Additionally, {@link from} must be less than or equal to {@link to}.
 */
export class LineSegment {
  readonly line: number
  readonly from: number
  readonly to: number

  static of(props: LineSegmentProps): LineSegment {
    return new LineSegment(props)
  }

  private constructor({ line, from, to }: LineSegmentProps) {
    Require.nonNegativeInteger(line)
    Require.nonNegativeInteger(from)
    Require.nonNegativeInteger(to)
    Require.validRange({ from, to })

    this.line = line
    this.from = from
    this.to = to
  }

  /**
   * Returns the start of the line segment represented as a {@link Position}.
   */
  get fromPosition(): Position {
    return { line: this.line, ch: this.from }
  }

  /**
   * Returns the end of the line segment represented as a {@link Position}.
   */
  get toPosition(): Position {
    return { line: this.line, ch: this.to }
  }

  /**
   * Returns a new {@link LineSegment} shifted down by the given {@link addedLines}.
   */
  plusLines(addedLines: number): LineSegment {
    Require.integer(addedLines)

    return LineSegment.of({ line: this.line + addedLines, from: this.from, to: this.to })
  }

  /**
   * Returns true if `this` deeply equals {@link other}.
   */
  equals(other: LineSegment): boolean {
    return this.line === other.line && this.from === other.from && this.to === other.to
  }
}
