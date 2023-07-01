import { Require } from "@ext/stdlib/Require"

export interface RetrierProps {
  readonly window: Window
}

/**
 * Performs asynchronous retrying with exponential backoff using {@link window#setTimeout}.
 */
export class Retrier {
  private readonly window: Window

  static create(props: RetrierProps): Retrier {
    return new Retrier(props)
  }

  private constructor(props: RetrierProps) {
    this.window = props.window
  }

  /**
   * Repeatedly calls {@link fn} until the call succeeds and returns the successful response.
   * The delay between retries starts at {@link startDelayMillis} and doubles each time until
   * {@link isSuccess} returns true.
   *
   * The {@link startDelayMillis} must be a non-negative integer.
   */
  async retry<T>({
    fn,
    isSuccess,
    startDelayMillis,
  }: {
    fn: () => Promise<T>
    isSuccess: (response: T) => boolean
    startDelayMillis: number
  }): Promise<T> {
    Require.nonNegativeInteger(startDelayMillis)

    let delayMillis = startDelayMillis
    let response = await fn()
    while (!isSuccess(response)) {
      await this.delay(delayMillis)
      delayMillis *= 2
      response = await fn()
    }

    return response
  }

  private async delay(millis: number): Promise<void> {
    return await new Promise((it) => this.window.setTimeout(it, millis))
  }
}
