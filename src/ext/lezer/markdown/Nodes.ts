import { NodeDescription } from "@lezer/common"

/**
 * Functions on lezer markdown syntax nodes.
 */
export namespace Nodes {
  /**
   * Returns true if the {@link node} represents `FencedCode`.
   *
   * This is the parent node of a fenced code block.
   *
   * @see https://github.com/lezer-parser/markdown/blob/main/src/markdown.ts#L432
   */
  export function isFencedCode(node: NodeDescription): boolean {
    return node.name === "FencedCode"
  }

  /**
   * Returns true if the {@link node} represents `CodeMark`.
   *
   * This is a child of `FencedCode` that represents the opening / closing fence marks (e.g. `~~~`).
   *
   * @see https://github.com/lezer-parser/markdown/blob/main/src/markdown.ts#L411-L421
   */
  export function isCodeMark(node: NodeDescription): boolean {
    return node.name === "CodeMark"
  }

  /**
   * Returns true if the {@link node} represents `CodeInfo`.
   *
   * This is a child of `FencedCode` that represents the opening fence language (e.g. `typescript`).
   *
   * @see https://github.com/lezer-parser/markdown/blob/main/src/markdown.ts#L413
   */
  export function isCodeInfo(node: NodeDescription): boolean {
    return node.name === "CodeInfo"
  }
}
