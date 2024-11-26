import { syntaxTree } from "@codemirror/language"
import { EditorState, Line, LineRef, Text } from "@codemirror/state"
import { NodeDescription } from "@lezer/common"
import { Arrays } from "@ts-belt"

import { Nodes } from "@ext/lezer/markdown/Nodes"
import { def, nil } from "@ext/stdlib/existence"

import { CodeBlock } from "@cm-extension/cm6/model/CodeBlock"
import { CodeDocs } from "@cm-extension/cm6/model/CodeDocs"
import { FenceMatcher } from "@cm-extension/cm6/parsing/FenceMatcher"

/**
 * Parses {@link CodeBlock}s from markdown syntax tree nodes.
 */
export namespace CodeBlocksParser {
  interface CodeBlockNodes {
    readonly openingCodeMark: NodeDescription
    readonly codeInfo: NodeDescription | undefined
    readonly closingCodeMark: NodeDescription
  }

  /**
   * Returns the {@link CodeBlock}s in the {@link state} (syntax tree / doc).
   *
   * Coverts each fenced code branch in the markdown syntax tree into a {@link CodeBlock}.
   *
   * If any nested or incomplete code fences exist, returns an empty list.
   *
   * A "nested" code fence is one that contains another code fence within it (i.e. there is another
   * start sequence before the end sequence of the ongoing code fence).
   *
   * e.g. the following nested code fences are invalid:
   * <pre>
   * ~~~typescript
   * ~~~typescript
   * ~~~
   * ~~~
   * </pre>
   *
   * A code fence is incomplete when it has no end.
   *
   * e.g. the following doc is invalid:
   * <pre>
   * ~~~
   * ~~~
   * ~~~
   * </pre>
   *
   * Incomplete code fences are technically allowed by the CommonMark spec as well as
   * CodeMirror (they extend until the end of the document), however it makes a lot more sense
   * to require complete code fences for rendering purposes.
   *
   * Additionally, nested code fences are sometimes treated as valid code inside code fences.
   * However, these often arise temporarily when typing a new opening code fence.
   * During this intermediate time, the syntax tree may parse the new opening fence as the beginning
   * of a (preexisting) code block.
   * This hinders autocompletion, since the new opening fence gets absorbed and rendered.
   * So it makes more sense to simply require no nested code fences to avoid this situation.
   *
   * There may be more than one nested/incomplete code fence in the doc, but the
   * parsing stops after encountering the first issue.
   *
   * ---
   *
   * The structure of the markdown syntax tree is as follows:
   *
   * - `Document` :: root
   *   - `(other nodes)`
   *   -  `FencedCode` :: (always-present) code fence wrapper
   *       - `CodeMark`    :: (always present)  opening code fence characters (e.g. `~~~`)
   *       - `CodeInfo`    :: (possibly present) opening code fence language portion (e.g. `python`)
   *       - `CodeText`    :: (possibly present) code portion (e.g. `print("Hello World")`)
   *       - `CodeMark`    :: (possibly present) closing code fence characters (e.g. `~~~`)
   *   - `(other nodes)`
   *
   * Note that the `CodeMark` nodes *don't* include the optional indentation (spaces)
   * that may be present before fences.
   * However, the parsed {@link CodeBlock}s produced *do* consider the whitespace to be part of
   * the fences.
   */
  export function parse(state: EditorState): CodeBlock[] {
    const cursor = syntaxTree(state).cursor()
    const codeBlocks: CodeBlock[] = []

    // Iterate over all immediate children of the `Document` root node
    for (let hasNext = cursor.next(true); hasNext; hasNext = cursor.next(false)) {
      if (!Nodes.isFencedCode(cursor)) continue

      // Enter the `FencedCode` node
      cursor.next()

      // Iterate over all immediate children of the `FencedCode` node
      const fencedCodeChildren: NodeDescription[] = []
      do {
        fencedCodeChildren.push({ name: cursor.name, from: cursor.from, to: cursor.to })
      } while (cursor.nextSibling())

      const codeBlock = createCodeBlock(state.doc, fencedCodeChildren)
      if (nil(codeBlock)) return []

      codeBlocks.push(codeBlock)
    }

    return codeBlocks
  }

  function createCodeBlock(doc: Text, children: readonly NodeDescription[]): CodeBlock | undefined {
    const codeBlockNodes = categorizeChildren(children)
    if (nil(codeBlockNodes)) return undefined

    const codeBlock = extractCodeBlock(doc, codeBlockNodes)

    if (hasFenceInside(doc, codeBlock)) return undefined

    return codeBlock
  }

  function categorizeChildren(children: readonly NodeDescription[]): CodeBlockNodes | undefined {
    // Ensure that the code block is "complete" (has an opening and closing fence)
    if (children.length < 2) return undefined
    if (!Nodes.isCodeMark(Arrays.last(children)!)) return undefined

    // Children array is one of the following:
    // [CodeMark,                     CodeMark]
    // [CodeMark, CodeInfo,           CodeMark]
    // [CodeMark,           CodeText, CodeMark]
    // [CodeMark, CodeInfo, CodeText, CodeMark]
    return {
      openingCodeMark: Arrays.head(children)!,
      closingCodeMark: Arrays.last(children)!,
      codeInfo: Nodes.isCodeInfo(children[1]) ? children[1] : undefined,
    }
  }

  function extractCodeBlock(
    doc: Text,
    { openingCodeMark, codeInfo, closingCodeMark }: CodeBlockNodes,
  ): CodeBlock {
    return CodeBlock.of({
      // `CodeMark` nodes don't include indentation, so begin at the start of the line instead
      openingFence: createLineRef(doc.lineAt(openingCodeMark.from)),
      closingFence: createLineRef(doc.lineAt(closingCodeMark.from)),
      lang: def(codeInfo) ? doc.sliceString(codeInfo.from, codeInfo.to) : undefined,
    })
  }

  function createLineRef({ from, to, number, text }: Line): LineRef {
    return { from, to, number, text }
  }

  function hasFenceInside(doc: Text, codeBlock: CodeBlock): boolean {
    for (const text of CodeDocs.iterCodeLines(doc, codeBlock, { includeFences: false })) {
      if (FenceMatcher.matchesOpeningFence(text)) return true
    }
    return false
  }
}
