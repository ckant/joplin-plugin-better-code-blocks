/**
 * Test extensions for `vitest`.
 */
export namespace Vitest {
  /**
   * Creates a new {@link Promise} which, when awaited, settles earlier {@link Promise}s in the queue.
   */
  export async function settlePendingPromises(): Promise<void> {
    await new Promise(setImmediate)
  }
}
