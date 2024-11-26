import { ReadonlyDoc } from "codemirror"

import { nil } from "@ext/stdlib/existence"

import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { Config } from "@cm-extension/cm5/model/Config"
import { Parser } from "@cm-extension/cm5/Parser"

export interface RenderParserProps {
  readonly config: Config
  readonly parser: Parser
}

/**
 * Parses code fences with the given {@link parser} according to the given {@link config}.
 */
export class RenderParser {
  private readonly config: Config
  private readonly parser: Parser

  static create(props: RenderParserProps): RenderParser {
    return new RenderParser(props)
  }

  private constructor(props: RenderParserProps) {
    this.config = props.config
    this.parser = props.parser
  }

  /**
   * Returns {@link CodeBlock}s in {@link doc}, excluding those with {@link config#excludedLanguages}.
   */
  parse(doc: ReadonlyDoc): readonly CodeBlock[] {
    const allCodeBlocks = this.parser.parse(doc)
    return allCodeBlocks.filter((it) => !this.isExcluded(it))
  }

  private isExcluded({ lang }: CodeBlock): boolean {
    if (nil(lang)) return false
    return this.config.excludedLanguages.includes(lang)
  }
}
