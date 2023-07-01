export interface FakeKeyboardEventProps {
  /**
   * The keyboard code to set on the event (defaults to "Space").
   */
  readonly code?: string
}

export type FakeKeyboardEvent = KeyboardEvent & Extensions
export namespace FakeKeyboardEvent {
  export function create(props?: FakeKeyboardEventProps): FakeKeyboardEvent {
    return new ExtendedKeyboardEvent(props) as unknown as FakeKeyboardEvent
  }
}

type PartialKeyboardEvent = Pick<KeyboardEvent, "code" | "preventDefault">

export interface Extensions {
  readonly ext: {
    /**
     * Set to true if `preventDefault` executes on the {@link KeyboardEvent}.
     */
    readonly defaultPrevented: boolean
  }
}

// noinspection JSUnusedGlobalSymbols
class ExtendedKeyboardEvent implements PartialKeyboardEvent, Extensions {
  readonly code: string

  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    defaultPrevented = false
  })()

  constructor(props?: FakeKeyboardEventProps) {
    this.code = props?.code ?? "Space"
  }

  preventDefault(): void {
    this.ext.defaultPrevented = true
  }
}
