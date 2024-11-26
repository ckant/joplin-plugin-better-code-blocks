import "@codemirror/autocomplete"
import "@codemirror/state"
import "@codemirror/view"

import { CompletionContext, CompletionResult } from "@codemirror/autocomplete"
import {
  Facet,
  Line,
  RangeSet,
  RangeValue,
  StateField,
  Transaction,
  TransactionSpec,
} from "@codemirror/state"
import { Decoration, DecorationSet, EditorView, PluginValue, ViewUpdate } from "@codemirror/view"

declare module "@codemirror/state" {
  /**
   * A line of {@link Text} (mimics the {@link Line} type definition).
   *
   * Useful since {@link Line} has no public constructor.
   */
  export type LineRef = Pick<Line, "from" | "to" | "number" | "text">

  /**
   * Config for a {@link StateField}.
   *
   * Useful since the corresponding type is not exported.
   */
  export type StateFieldSpec<T> = Parameters<typeof StateField.define<T>>[0]

  /**
   * Config for a {@link EditorView.transactionFilter} Facet that returns an array.
   *
   * Useful to describe this smaller subset of transaction filters.
   *
   * Additionally, {@link EditorView.transactionFilter} is defined as a Facet with Input of
   * `(Transaction) => TransactionSpec | readonly TransactionSpec[]`
   * when it is more accurately a Facet with Input of
   * `(Transaction) => Transaction | TransactionSpec | readonly (Transaction | TransactionSpec)[]`
   * since it allows return of the original `Transaction`.
   */
  export type TransactionFilterSpec = (
    tr: Transaction,
  ) => readonly (Transaction | TransactionSpec)[]

  /**
   * Config for a {@link Facet}.
   *
   * Useful since the corresponding type is not exported.
   */
  export type FacetSpec<Input, Output> = NonNullable<
    Parameters<typeof Facet.define<Input, Output>>[0]
  >
}

declare module "@codemirror/view" {
  /**
   * Config for a {@link Decoration.line}.
   *
   * Useful since the corresponding type is not exported.
   */
  export type LineDecorationSpec = Parameters<typeof Decoration.line>[0]

  /**
   * Config for a {@link Decoration.replace}.
   *
   * Useful since the corresponding type is not exported.
   */
  export type ReplaceDecorationSpec = Parameters<typeof Decoration.replace>[0]

  /**
   * Config for an {@link EditorView.updateListener}.
   *
   * Useful to describe the listener.
   */
  export type UpdateListenerSpec = (update: ViewUpdate) => void

  /**
   * Config for a {@link EditorView.baseTheme}.
   *
   * Useful to describe the theme.
   */
  export type ThemeSpec = Parameters<typeof EditorView.baseTheme>[0]

  /**
   * Config for {@link EditorView.atomicRanges}.
   *
   * Useful to describe the ranges.
   *
   * Additionally, {@link EditorView.atomicRanges} accepts `RangeSet<any>` when
   * it should actually be `RangeSet<RangeValue>`.
   */
  export type AtomicRangesSpec = (view: EditorView) => RangeSet<RangeValue>

  /**
   * Config for a {@link EditorView.editorAttributes}.
   *
   * Useful since the corresponding type is not exported.
   */
  export type AttrSource = Parameters<typeof EditorView.editorAttributes.of>[0]

  /**
   * {@link PluginValue} that stores a {@link DecorationSet}.
   *
   * Useful since this is the typical use of a {@link PluginValue} / {@link ViewPluginSpec} combo.
   */
  export type DecoratedPluginValue = PluginValue & { readonly decorations: DecorationSet }
}

declare module "@codemirror/autocomplete" {
  /**
   * A `CompletionSource` that returns synchronously.
   *
   * Useful to describe this smaller subset of `CompletionSource`s.
   */
  export type SyncCompletionSource = (context: CompletionContext) => CompletionResult | null
}
