import { Retrier } from "@ext/stdlib/Retrier"

export type FakeRetrier = Retrier & Extensions
export namespace FakeRetrier {
  export function create(): FakeRetrier {
    return new ExtendedRetrier() as unknown as FakeRetrier
  }
}

type PartialRetrier = Pick<Retrier, "retry">

export interface Extensions {
  readonly ext: {
    /**
     * Represents a summary of the retries by {@link Retrier#retry} (if called).
     */
    readonly result: RetryResult | undefined
  }
}

/**
 * Represents a summary of the retries by {@link Retrier#retry}.
 */
export interface RetryResult {
  /**
   * The `startDelayMillis` sent in the call to {@link Retrier#retry}.
   */
  startDelayMillis: number

  /**
   * The total retries performed before success.
   */
  retryCount: number

  /**
   * The successful response.
   */
  response: unknown
}

// noinspection JSUnusedGlobalSymbols
class ExtendedRetrier implements PartialRetrier, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    result: RetryResult | undefined
  })()

  async retry<T>({
    fn,
    isSuccess,
    startDelayMillis,
  }: {
    fn: () => Promise<T>
    isSuccess: (response: T) => boolean
    startDelayMillis: number
  }): Promise<T> {
    let retryCount = 0
    let response = await fn()
    while (!isSuccess(response)) {
      response = await fn()
      retryCount++
    }

    this.ext.result = { startDelayMillis, retryCount, response }
    return response
  }
}
