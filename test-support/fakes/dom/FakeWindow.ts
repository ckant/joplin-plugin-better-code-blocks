import { Guards } from "@ts-belt"

export interface FakeWindowProps {
  /**
   * Pauses calls to {@link window#setTimeout} to allow for manual testing (defaults to false).
   */
  readonly pauseTimeouts?: boolean
}

export type FakeWindow = Window & Extensions
export namespace FakeWindow {
  export function create(props?: FakeWindowProps): FakeWindow {
    return new ExtendedWindow(props) as unknown as FakeWindow
  }
}

type PartialWindow = Pick<Window, "setTimeout">

export interface Extensions {
  readonly ext: {
    /**
     * Represents calls made to {@link window#setTimeout}.
     */
    readonly setTimeouts: readonly SetTimeout[]
  }
}

/**
 * Represents a call to {@link window#setTimeout}.
 */
export interface SetTimeout {
  /**
   * The timeout sent to {@link window#setTimeout} (if provided).
   */
  readonly timeout: number | undefined

  /**
   * Runs the callback sent to {@link window#setTimeout}.
   */
  run(): unknown
}

// noinspection JSUnusedGlobalSymbols
class ExtendedWindow implements PartialWindow, Extensions {
  private readonly pauseTimeouts: boolean

  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    readonly setTimeouts: SetTimeout[] = []
  })()

  constructor(props?: FakeWindowProps) {
    this.pauseTimeouts = props?.pauseTimeouts ?? false
  }

  setTimeout(handler: TimerHandler, timeout?: number): number {
    if (Guards.isString(handler)) {
      throw new TypeError("string handler is unsupported")
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- setTimeout uses Function
    const run: () => unknown = () => handler()
    this.ext.setTimeouts.push({ run, timeout })
    if (!this.pauseTimeouts) run()

    return 0
  }
}
