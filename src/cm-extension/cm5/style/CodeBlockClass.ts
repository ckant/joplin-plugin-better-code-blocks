/**
 * CM extension CSS classes.
 */
export const CodeBlockClass = {
  // Code fence start line
  startBackground: "cb-start-background",
  startLine: "cb-start-line",
  startText: "cb-start-text",

  // Code fence code lines
  codeBackground: "cb-code-background",
  codeLine: "cb-code-line",
  codeText: "cb-code-text",

  // Code fence end line
  endBackground: "cb-end-background",
  endLine: "cb-end-line",
  endText: "cb-end-text",

  // Widgets that replace start and end line content
  startWidget: "cb-start-widget",
  endWidget: "cb-end-widget",

  // Tag for when the user clicks the copy button
  copied: "cb-copied",

  // Button that copies code fence
  copyBtn: "cb-copy-btn",

  // First and last code fence lines
  first: "cb-first",
  last: "cb-last",

  // Opening and closing fence content
  openingFence: "cb-opening-fence",
  closingFence: "cb-closing-fence",

  // Lang content
  lang: "cb-lang",
} as const
export type CodeBlockClass = (typeof CodeBlockClass)[keyof typeof CodeBlockClass]
