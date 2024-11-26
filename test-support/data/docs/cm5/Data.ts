import { Doc } from "codemirror"
import { readFileSync } from "fs"
import { Arrays } from "@ts-belt"

import { Arrays as ArraysExt } from "@ext/stdlib/Arrays"

import { CodeBlock } from "@cm-extension/cm5/model/CodeBlock"
import { CodeDocs } from "@cm-extension/cm5/model/CodeDocs"
import { Parser } from "@cm-extension/cm5/Parser"

/**
 * Loads test data for pre-defined {@link Doc}s.
 */
export namespace Data {
  /**
   * Represents data for a {@link Doc} with a single {@link CodeBlock}.
   */
  export interface Single {
    readonly text: string
    readonly doc: Doc
    readonly codeBlock: CodeBlock
    readonly codeText: string
  }

  /**
   * Represents data for a {@link Doc} with multiple {@link CodeBlock}s.
   */
  export interface Multiple {
    readonly text: string
    readonly doc: Doc
    readonly codeBlocks: readonly CodeBlock[]
  }

  /**
   * Represents data for a {@link Doc} with no {@link CodeBlock}s.
   */
  export interface None {
    readonly text: string
    readonly doc: Doc
  }

  /**
   * Represents data for a {@link Doc} with {@link CodeBlock}s that are incomplete or invalid.
   */
  export type Invalid = None

  /**
   * Loads {@link Single} doc data at {@link path}.
   */
  export function single(path: string): () => Single {
    return () => {
      const text = data(`./test-support${path}`)
      const doc = new Doc(text)
      const codeBlock = onlyCodeBlock(doc)
      const codeText = CodeDocs.getCode(doc, codeBlock)

      return { text, doc, codeBlock, codeText }
    }
  }

  /**
   * Loads {@link Multiple} doc data at {@link path}.
   */
  export function multiple(path: string): () => Multiple {
    return () => {
      const text = data(`./test-support${path}`)
      const doc = new Doc(text)
      const codeBlocks = multipleCodeBlocks(doc)

      return { text, doc, codeBlocks }
    }
  }

  /**
   * Loads {@link None} doc data at {@link path}.
   */
  export function none(path: string): () => None {
    return () => {
      const text = data(`./test-support${path}`)
      const doc = new Doc(text)
      requireNoCodeBlocks(doc)

      return { text, doc }
    }
  }

  /**
   * Loads {@link Invalid} doc data at {@link path}.
   */
  export function invalid(path: string): () => Invalid {
    return none(path)
  }
}

function data(path: string): string {
  return readFileSync(path, "utf8")
}

function requireNoCodeBlocks(doc: Doc): void {
  const codeBlocks = Parser.create().parse(doc)
  if (Arrays.isNotEmpty(codeBlocks)) throw new Error("Doc should contain no code blocks")
}

function onlyCodeBlock(doc: Doc): CodeBlock {
  return ArraysExt.onlyElement(Parser.create().parse(doc))
}

function multipleCodeBlocks(doc: Doc): readonly CodeBlock[] {
  const codeBlocks = Parser.create().parse(doc)
  if (codeBlocks.length < 2) throw new Error("Doc should contain multiple code blocks")

  return codeBlocks
}
