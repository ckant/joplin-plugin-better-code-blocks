/**
 * CM extension CSS classes.
 */
export const CodeBlockClass = {
  // Opening code fence line
  startLine: "cb-start-line",

  // Code lines
  codeLine: "cb-code-line",

  // Closing code fence line
  endLine: "cb-end-line",

  // Widgets that replace opening and closing fence text
  startWidget: "cb-start-widget",
  endWidget: "cb-end-widget",

  // Tag added when the user clicks the copy button
  copied: "cb-copied",

  // Button that copies code
  copyBtn: "cb-copy-btn",

  // First and last code lines
  first: "cb-first",
  last: "cb-last",

  // Opening and closing fence text
  openingFence: "cb-opening-fence",
  closingFence: "cb-closing-fence",

  // Lang text
  lang: "cb-lang",
} as const
export type CodeBlockClass = (typeof CodeBlockClass)[keyof typeof CodeBlockClass]
