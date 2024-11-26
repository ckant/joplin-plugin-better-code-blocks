import "@lezer/common"
import "@lezer/markdown"

import { SyntaxNodeRef } from "@lezer/common"

declare module "@lezer/common" {
  /**
   * Description of a lezer syntax node (mimics the {@link SyntaxNodeRef} type definition).
   *
   * Useful to describe a smaller subset of attributes.
   */
  export type NodeDescription = Pick<SyntaxNodeRef, "name" | "from" | "to">
}
