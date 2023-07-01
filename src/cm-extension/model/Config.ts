/**
 * Configuration for the {@link CmExtension}.
 */
export interface Config {
  /**
   * Automatic completion of code blocks.
   */
  readonly completion: "enabled" | "disabled"

  /**
   * Portion of the code block to copy when the user clicks the copy button.
   */
  readonly copyFormat: "code" | "fencedCode"

  /**
   * Style of the borders of rendered code blocks.
   */
  readonly cornerStyle: "square" | "round"

  /**
   * Languages of code blocks that skip rendering.
   */
  readonly excludedLanguages: readonly string[]

  /**
   * Rendering of code blocks.
   */
  readonly rendering: "enabled" | "disabled"

  /**
   * Layout of the rendered code blocks.
   */
  readonly renderLayout: "minimal" | "standard"

  /**
   * Change `Select All` to instead select an entire code block (if the cursor is inside it).
   */
  readonly selectAllCapturing: "enabled" | "disabled"
}
