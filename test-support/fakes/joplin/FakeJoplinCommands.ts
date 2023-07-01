import JoplinCommands from "api/JoplinCommands"

export type FakeJoplinCommands = JoplinCommands & Extensions
export namespace FakeJoplinCommands {
  export function create(): FakeJoplinCommands {
    return new ExtendedJoplinCommands() as unknown as FakeJoplinCommands
  }
}

type PartialJoplinCommands = Pick<JoplinCommands, "execute">

export interface Extensions {
  readonly ext: {
    /**
     * Represents the call to {@link JoplinCommands#execute} (if performed).
     */
    readonly execution: Execution | undefined
  }
}

/**
 * Represents the call to {@link JoplinCommands#execute}.
 */
export interface Execution {
  readonly commandName: string
  readonly args: readonly unknown[]
}

// noinspection JSUnusedGlobalSymbols
class ExtendedJoplinCommands implements PartialJoplinCommands, Extensions {
  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    execution: Execution | undefined
  })()

  async execute(commandName: string, ...args: readonly unknown[]): Promise<unknown> {
    this.ext.execution = { commandName, args }
    return Promise.resolve()
  }
}
