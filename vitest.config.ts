import { defineConfig, mergeConfig, UserConfig } from "vitest/config"

import tsconfigPaths from "vite-tsconfig-paths"

/**
 * Configuration for tests.
 */
const testConfig: UserConfig = {
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ["./test-support/TestSetup.ts"],
    environment: "happy-dom",
    coverage: {
      include: ["src/**/*"],

      // Exclude files that contain only type definitions which show up
      // as having 0% coverage for some reason
      exclude: [
        "src/cm-extension/marker/line-styler/LineStyle.ts*",
        "src/cm-extension/marker/widgeter/Widget.ts*",
        "src/cm-extension/model/Config.ts",
        "src/cm-extension-ipc/model/*",
        "src/joplin-plugin/settings/PluginSettings.ts",
        "src/joplin-plugin-ipc/model/*",
      ],

      // Include all files in coverage, including those that are untested
      all: true,
    },
  },
}

const configs = new Map([
  // Run all tests by default (`npm run test`)
  ["test", testConfig],

  // Run only unit tests (`npm run test:unit`)
  ["unit-test", mergeConfig(testConfig, { test: { include: ["test/**/*"] } })],

  // Run only integration tests (`npm run test:integ`)
  ["integration-test", mergeConfig(testConfig, { test: { include: ["test-integration/**/*"] } })],
])

// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode }) => {
  if (!configs.has(mode))
    throw new Error(`Invalid mode "${mode}" (expected one of [${[...configs.keys()].toString()}])`)

  return configs.get(mode)!
})
