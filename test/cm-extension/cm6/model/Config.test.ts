import { describe, expect, it } from "vitest"

import { Config } from "@cm-extension/cm6/model/Config"

describe("Config", () => {
  describe("createDefault", () => {
    it("creates a default config", () => {
      const firstConfig = Config.createDefault()
      const secondConfig = Config.createDefault()
      expect(firstConfig).toStrictEqual(secondConfig)
      expect(firstConfig).not.toBe(secondConfig)
    })
  })
})
