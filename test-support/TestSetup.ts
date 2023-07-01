/**
 * Main entry-point for Vitest test setup.
 *
 * Vitest imports this before each test file (i.e. importing this file has the side effect
 * of setting up the tests).
 */

import { resetAll, setDefaults, verifyAll } from "strong-mock"
import { afterEach, expect } from "vitest"

import { JestExtendedMatchers } from "test-support/matchers/JestExtendedMatchers"
import { MapMatchers } from "test-support/matchers/MapMatchers"
import { SetMatchers } from "test-support/matchers/SetMatchers"

/**
 * Runs for each test file.
 */
namespace TestSetup {
  export function initialize(): void {
    initializeMockingConfig()
    initializeMatchers()
    initializeMocking()
  }

  /**
   * Increases strictness of `strong-mock` mocks.
   */
  const initializeMockingConfig = function (): void {
    setDefaults({ exactParams: true })
  }

  /**
   * Adds additional matchers.
   */
  const initializeMatchers = function (): void {
    expect.extend(MapMatchers)
    expect.extend(SetMatchers)
    expect.extend(JestExtendedMatchers)
  }

  /**
   * Verifies and resets all mocks after each test, allowing for mock re-use and brevity.
   */
  const initializeMocking = function (): void {
    afterEach(() => {
      verifyAll()
      resetAll()
    })
  }
}

TestSetup.initialize()
