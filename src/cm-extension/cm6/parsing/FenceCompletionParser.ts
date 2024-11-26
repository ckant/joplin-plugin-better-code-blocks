import { syntaxTree } from "@codemirror/language"
import { EditorState } from "@codemirror/state"
import { SyntaxNode } from "@lezer/common"

import { Nodes } from "@ext/lezer/markdown/Nodes"
import { def, nil } from "@ext/stdlib/existence"

/**
 * Parses code fences from markdown syntax tree nodes for use by autocompletion.
 */
export namespace FenceCompletionParser {
  const minCodeMarkSize = 3

  /**
   * Returns the opening fence present at the given {@link position} in
   * the {@link state} (syntax tree / doc), if any.
   *
   * The structure of an opening fence in the markdown syntax tree is as follows:
   *
   * - `FencedCode`  :: (always present) code fence wrapper
   *   - `CodeMark`    :: (always present)  opening code fence characters (e.g. `~~~`)
   *   - `CodeInfo`    :: (possibly present) opening code fence language portion (e.g. `python`)
   *
   * Note that the `CodeMark` node *doesn't* include the optional indentation (spaces)
   * that may be present before the opening code fences.
   *
   * For an opening fence, the inner syntax node to the left of {@link position} will always
   * be either the `CodeMark` or the `CodeInfo`.
   */
  export function parseOpeningFenceAt(
    state: EditorState,
    position: number,
  ): { indent: string; codeMark: string; codeInfoPrefix: string } | undefined {
    if (position < minCodeMarkSize) return undefined

    const currentNode = syntaxTree(state).resolveInner(position, -1)
    const openingFenceNodes = findOpeningFenceNodesAt(currentNode)
    if (nil(openingFenceNodes)) return undefined

    const { codeMark, codeInfo } = openingFenceNodes
    const { doc } = state
    return {
      indent: doc.sliceString(doc.lineAt(position).from, codeMark.from),
      codeMark: doc.sliceString(codeMark.from, def(codeInfo) ? codeInfo.from : position),
      codeInfoPrefix: def(codeInfo) ? doc.sliceString(codeInfo.from, position) : "",
    }
  }

  function findOpeningFenceNodesAt(
    node: SyntaxNode,
  ): { codeMark: SyntaxNode; codeInfo: SyntaxNode | undefined } | undefined {
    if (isOpeningCodeMark(node)) return { codeMark: node, codeInfo: undefined }
    if (Nodes.isCodeInfo(node)) return { codeMark: node.prevSibling!, codeInfo: node }

    return undefined
  }

  function isOpeningCodeMark(node: SyntaxNode): boolean {
    if (!Nodes.isCodeMark(node)) return false

    // Ensure that CodeMark isn't a closing code fence's CodeMark
    const fencedCode = node.parent!
    return node.from === fencedCode.from
  }
}
