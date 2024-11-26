import { describe, expect, it } from "vitest"

import { JoplinPlugins } from "@ext/joplin/JoplinPlugins"

import { FakeCodeMirror5 } from "test-support/fakes/joplin/FakeCodeMirror5"
import { FakeCodeMirror6 } from "test-support/fakes/joplin/FakeCodeMirror6"

describe("JoplinPlugins", () => {
  describe("isCodeMirror6", () => {
    it("returns true when code mirror 6", () => {
      expect(JoplinPlugins.isCodeMirror6(FakeCodeMirror6.create())).toBeTrue()
    })

    it("returns false when code mirror 5", () => {
      expect(JoplinPlugins.isCodeMirror6(FakeCodeMirror5.create())).toBeFalse()
    })
  })
})
