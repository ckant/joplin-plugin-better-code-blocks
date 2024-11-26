import { CmExtension } from "@cm-extension/cm5/CmExtension"

/**
 * Represents specific origins for tagging the source of {@link CodeMirror} write operations.
 */
export const Origin = {
  /**
   * Originates from {@link RenderHandler}.
   */
  RenderHandler: `${CmExtension.extensionName}.RenderHandler`,

  /**
   * Originates from {@link CompleteHandler}.
   */
  CompleteHandler: `${CmExtension.extensionName}.CompleteHandler`,
} as const

export type Origin = (typeof Origin)[keyof typeof Origin]
