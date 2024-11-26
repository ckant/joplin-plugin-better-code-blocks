import { Completion, pickedCompletion, SyncCompletionSource } from "@codemirror/autocomplete"
import { Arrays, Strings } from "@ts-belt"

import { CompletionType } from "@ext/codemirror/cm6/autocomplete/CompletionType"
import { def, nil } from "@ext/stdlib/existence"

import { Config } from "@cm-extension/cm6/model/Config"
import { FenceCompletionParser } from "@cm-extension/cm6/parsing/FenceCompletionParser"

/**
 * Automatically completes code fences.
 *
 * - Provides a completion option:
 *   - For a language-less code fence (\`\`\`, \`\`\`\`\`, ~~~, ~~~~, etc.)
 *   - For each matching language code fence in {@link completedLanguages} (e.g. ~~~c, ~~~~c)
 *   - For any other code fence that's returned verbatim (e.g. ~~~~~mycustomlang)
 *
 * e.g. given the following incomplete code fence (with the cursor at the end of the line):
 * <pre>
 * ~~~j
 * </pre>
 *
 * one completion option could be as follows (with the cursor moved inside the fence):
 * <pre>
 * ~~~java
 *
 * ~~~
 * </pre>
 *
 * another completion option could be:
 * <pre>
 * ~~~javascript
 *
 * ~~~
 * </pre>
 *
 * and a final completion option (with the lowest precedence) could be:
 * <pre>
 * ~~~j
 *
 * ~~~
 * </pre>
 */
export function CompletionSource({ completedLanguages }: Config): SyncCompletionSource {
  return ({ state, pos }) => {
    const openingFence = FenceCompletionParser.parseOpeningFenceAt(state, pos)
    // eslint-disable-next-line unicorn/no-null -- CompletionSource uses null
    if (nil(openingFence)) return null

    const { codeInfoPrefix } = openingFence
    const matchedLanguages = completedLanguages.filter((it) => it.startsWith(codeInfoPrefix))

    const languageOptions = matchedLanguages.map((desiredLang) =>
      createOption({ openingFence, pos, lineBreak: state.lineBreak, desiredLang }),
    )

    const isExactMatch = Arrays.includes(matchedLanguages, codeInfoPrefix)

    return {
      from: pos,
      options: isExactMatch
        ? [...languageOptions] // "as-is" option would be a duplicate here
        : [
            ...languageOptions,
            createOption({
              openingFence,
              pos,
              lineBreak: state.lineBreak,
              // Always push the unknown language as-is option to the bottom of the suggestions
              lowerRank: Strings.isNotEmpty(codeInfoPrefix),
            }),
          ],
    }
  }
}

function createOption({
  pos,
  lineBreak,
  openingFence: { indent, codeMark, codeInfoPrefix },
  lowerRank = false,
  desiredLang,
}: {
  pos: number
  lineBreak: string
  openingFence: { indent: string; codeMark: string; codeInfoPrefix: string }
  lowerRank?: boolean
  desiredLang?: string
}): Completion {
  const remainingChars = def(desiredLang) ? desiredLang.length - codeInfoPrefix.length : 0
  const remainingLang = def(desiredLang) ? desiredLang.slice(codeInfoPrefix.length) : ""

  return {
    label: `${codeMark}${def(desiredLang) ? desiredLang : codeInfoPrefix}`,
    type: CompletionType.type,
    apply: (view, completion) => {
      view.dispatch({
        annotations: pickedCompletion.of(completion),
        changes: {
          from: pos,
          insert: `${remainingLang}${lineBreak}${lineBreak}${indent}${codeMark}`,
        },
        selection: { anchor: pos + remainingChars + 1 },
      })
    },
    boost: lowerRank ? -1 : undefined,
  }
}
