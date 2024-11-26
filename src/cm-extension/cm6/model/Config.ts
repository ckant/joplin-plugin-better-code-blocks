/**
 * Configuration for {@link BetterCodeBlocks}.
 */
export interface Config {
  /**
   * Languages with autocompletion.
   */
  readonly completedLanguages: readonly string[]

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
export namespace Config {
  /**
   * Creates a {@link Config} with reasonable defaults.
   */
  export function createDefault(): Config {
    return {
      completedLanguages: [
        "bash",
        "c",
        "c#",
        "c++",
        "clojure",
        "clojurescript",
        "coffeescript",
        "cpp",
        "crystal",
        "cs",
        "csharp",
        "css",
        "d",
        "dart",
        "diff",
        "dockerfile",
        "ecmascript",
        "elm",
        "erlang",
        "f#",
        "forth",
        "fortran",
        "fsharp",
        "gherkin",
        "go",
        "groovy",
        "haskell",
        "haxe",
        "html",
        "http",
        "ini",
        "java",
        "javascript",
        "jinja2",
        "js",
        "json",
        "jsx",
        "julia",
        "kotlin",
        "latex",
        "less",
        "lisp",
        "lua",
        "markdown",
        "mathematica",
        "mysql",
        "node",
        "objc",
        "objc++",
        "objective-c",
        "objective-c++",
        "ocaml",
        "pascal",
        "perl",
        "php",
        "plsql",
        "postgresql",
        "powershell",
        "properties",
        "protobuf",
        "python",
        "r",
        "rake",
        "rb",
        "rscript",
        "rss",
        "ruby",
        "rust",
        "sass",
        "scala",
        "scheme",
        "scss",
        "sh",
        "shell",
        "smalltalk",
        "sql",
        "sqlite",
        "swift",
        "tcl",
        "toml",
        "ts",
        "tsx",
        "typescript",
        "vb.net",
        "vbscript",
        "verilog",
        "xhtml",
        "xml",
        "yaml",
        "yml",
        "zsh",
      ],
      completion: "enabled",
      rendering: "enabled",
      selectAllCapturing: "enabled",
      renderLayout: "minimal",
      cornerStyle: "square",
      excludedLanguages: [],
      copyFormat: "code",
    }
  }
}
