import { Doc, DOMEvent, Editor, EditorEventMap } from "codemirror"

import { def } from "@ext/stdlib/existence"

export interface FakeEditorProps {
  /**
   * The {@link Doc} to set for the {@link Editor} (defaults to an empty doc).
   */
  doc?: Doc
}

export type FakeEditor = Editor & Extensions
export namespace FakeEditor {
  export function create(props?: FakeEditorProps): FakeEditor {
    return new ExtendedEditor(props) as unknown as FakeEditor
  }
}

type PartialEditor = Pick<Editor, "getDoc" | "getWrapperElement" | "operation" | "on">

export interface Extensions {
  readonly ext: {
    /**
     * Data added to the {@link HTMLElement#dataset} of the {@link Editor} wrapper element.
     */
    readonly wrapperData: DOMStringMap

    /**
     * Event handlers added to the {@link Editor} with {@link Editor#on} (event name to handler).
     */
    readonly eventHandlers: ReadonlyMap<string, EventHandler>

    /**
     * Operations executed on {@link Editor} with {@link Editor.operation}.
     */
    readonly operation: (() => unknown) | undefined

    /**
     * Dispatches an {@link eventName} event to {@link eventHandlers}.
     */
    dispatchEvent(eventName: string, instance: Partial<Editor>, ...args: unknown[]): void
  }
}

export type EventHandler = (instance: Partial<Editor>, ...args: unknown[]) => void

// noinspection JSUnusedGlobalSymbols
class ExtendedEditor implements PartialEditor, Extensions {
  private readonly doc: Doc

  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    readonly wrapperElement = document.createElement("div")

    eventHandlers = new Map<string, EventHandler>()

    operation: (() => unknown) | undefined

    dispatchEvent(eventName: string, instance: Partial<Editor>, ...args: unknown[]): void {
      const handler = this.eventHandlers.get(eventName)
      if (def(handler)) handler(instance, ...args)
    }

    get wrapperData(): DOMStringMap {
      return this.wrapperElement.dataset
    }
  })()

  constructor(props?: FakeEditorProps) {
    this.doc = props?.doc ?? new Doc("")
  }

  operation<T>(fn: () => T): T {
    this.ext.operation = fn
    return fn()
  }

  getDoc(): Doc {
    return this.doc
  }

  on<T extends keyof EditorEventMap>(eventName: T, handler: EditorEventMap[T]): void
  on<K extends DOMEvent & keyof GlobalEventHandlersEventMap>(
    eventName: K,
    handler: (instance: Editor, event: GlobalEventHandlersEventMap[K]) => void,
  ): void
  on(eventName: string, handler: unknown): void {
    this.ext.eventHandlers.set(eventName, handler as EventHandler)
  }

  getWrapperElement(): HTMLElement {
    return this.ext.wrapperElement
  }
}
