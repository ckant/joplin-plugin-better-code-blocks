import { describe, expect, it } from "vitest"

import { JoplinCommands } from "@ext/joplin/JoplinCommands"

import { FakeJoplinCommands } from "test-support/fakes/joplin/FakeJoplinCommands"

describe("JoplinCommands", () => {
  describe("callCodeMirrorExtension", () => {
    it("calls execCommand with extension name and given arg", async () => {
      const fakeJoplinCommands = FakeJoplinCommands.create()

      await JoplinCommands.callCodeMirrorExtension(fakeJoplinCommands, "extensionName", "arg")

      expect(fakeJoplinCommands.ext.execution).toStrictEqual({
        commandName: "editor.execCommand",
        args: [{ name: "extensionName", args: ["arg"] }],
      })
    })
  })
})
