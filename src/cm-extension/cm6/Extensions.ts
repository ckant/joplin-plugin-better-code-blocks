import { EditorState, Extension, StateField } from "@codemirror/state"
import { EditorView, ViewPlugin } from "@codemirror/view"

import { Config } from "@cm-extension/cm6/model/Config"
import { ClosingFenceCursorFilter } from "@cm-extension/cm6/modification/cursor/ClosingFenceCursorFilter"
import { CodeFenceAtomicRanges } from "@cm-extension/cm6/modification/cursor/CodeFenceAtomicRanges"
import { OpeningFenceCursorFilter } from "@cm-extension/cm6/modification/cursor/OpeningFenceCursorFilter"
import { FenceLineBreakDeleteFilter } from "@cm-extension/cm6/modification/deletion/FenceLineBreakDeleteFilter"
import { EmptyCodeBlockUpdater } from "@cm-extension/cm6/modification/formatting/EmptyCodeBlockUpdater"
import { AllCodeSelectionFilter } from "@cm-extension/cm6/modification/selection/AllCodeSelectionFilter"
import { LastCodeLineSelectionFilter } from "@cm-extension/cm6/modification/selection/LastCodeLineSelectionFilter"
import { ConfigEditorAttributes } from "@cm-extension/cm6/rendering/ConfigEditorAttributes"
import { ViewPluginSpec } from "@cm-extension/cm6/rendering/ViewPluginSpec"
import { ViewPluginValue } from "@cm-extension/cm6/rendering/ViewPluginValue"
import { CodeBlocksStateField } from "@cm-extension/cm6/state/CodeBlocksStateField"
import { ConfigFacet } from "@cm-extension/cm6/state/ConfigFacet"
import { Theme } from "@cm-extension/cm6/theme/Theme"

/**
 * {@link Extension}s provided by BetterCodeBlocks.
 */
export namespace Extensions {
  /**
   * State field that stores {@link CodeBlock}s.
   *
   * @see CodeBlocksStateField
   */
  export const codeBlocksStateField = StateField.define(CodeBlocksStateField)

  /**
   * Transaction filter that prevents deletion of the line breaks immediately before the first code
   * line and after the last code line in a code block.
   *
   * @see FenceLineBreakDeleteFilter
   */
  export const fenceLineBreakDeleteFilter = EditorState.transactionFilter.of(
    FenceLineBreakDeleteFilter,
  )

  /**
   * Transaction filter that shrinks the selection to the last code line's code if
   * the {@link transaction} selects the entire last code line and the following line break.
   *
   * @see LastCodeLineSelectionFilter
   */
  export const lastCodeLineSelectionFilter = EditorState.transactionFilter.of(
    LastCodeLineSelectionFilter,
  )

  /**
   * Transaction filter that "pushes" the cursor out of the position
   * at the end of the opening fence.
   *
   * @see OpeningFenceCursorFilter
   */
  export const openingFenceCursorFilter = EditorState.transactionFilter.of(OpeningFenceCursorFilter)

  /**
   * Transaction filter that "pushes" the cursor out of the position
   *
   * @see ClosingFenceCursorFilter
   */
  export const closingFenceCursorFilter = EditorState.transactionFilter.of(ClosingFenceCursorFilter)

  /**
   * Transaction filter that shrinks the selection to select the code block code if the cursor
   * is inside the code fence and the {@link transaction} is due to a `Select All` action.
   *
   * @see AllCodeSelectionFilter
   */
  export const allCodeSelectionFilter = EditorState.transactionFilter.of(AllCodeSelectionFilter)

  /**
   * Provides atomic ranges over the opening and closing fences of all code blocks.
   *
   * @see CodeFenceAtomicRanges
   */
  export const codeFenceAtomicRanges = EditorView.atomicRanges.of(CodeFenceAtomicRanges)

  /**
   * Update listener that inserts a line break into each empty code block to create a code line.
   *
   * @see EmptyCodeBlockUpdater
   */
  export const emptyCodeBlockUpdater = EditorView.updateListener.of(EmptyCodeBlockUpdater)

  /**
   * Base theme that defines styles for code fences.
   *
   * @see Theme
   */
  export const theme = EditorView.baseTheme(Theme)

  /**
   * View plugin that generates, stores, and provides {@link CodeBlock} decorations.
   *
   * @see ViewPluginValue
   * @see ViewPluginSpec
   */
  export const viewPlugin = ViewPlugin.define(
    (view) => ViewPluginValue.create({ view }),
    ViewPluginSpec,
  )

  /**
   * Editor attributes that add Config values to the editor dataset.
   *
   * @see ConfigEditorAttributes
   */
  export const configEditorAttributes = EditorView.editorAttributes.compute(
    [ConfigFacet],
    ConfigEditorAttributes,
  )

  /**
   * Facet that stores the given {@link config}.
   *
   * @see ConfigFacet
   */
  export function configFacetOf(config: Config): Extension {
    return ConfigFacet.of(config)
  }
}
