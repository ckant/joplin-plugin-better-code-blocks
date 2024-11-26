import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import tsdoc from "eslint-plugin-tsdoc"
import unicorn from "eslint-plugin-unicorn"
import path from "node:path"
import { fileURLToPath } from "node:url"

const eslintRules = {
  // Disallow relative imports for better visibility into module coupling
  "no-restricted-imports": ["error", { patterns: [".*"] }],

  // Require destructuring from arrays and/or objects for brevity
  "prefer-destructuring": "error",

  // Disable eslint rules in favor of typescript-specific alternatives in @typescript-eslint
  "default-param-last": "off",
  "no-dupe-class-members": "off",
  "no-invalid-this": "off",
  "no-loop-func": "off",
  "no-shadow": "off",
}

const simpleInputSortRules = {
  // Sort imports for consistency
  "simple-import-sort/imports": [
    "error",
    {
      groups: [
        // Side effect imports
        ["^\\u0000"],

        // 3rd party packages
        [
          "^api",
          "^@codemirror",
          "^codemirror",
          "^fs",
          "^happy-dom",
          "^jest-extended",
          "^@lezer",
          "^@mobily",
          "^strong-mock",
          "^@ts-belt",
          "^type-fest",
          "^@vitest",
          "^vitest",
        ],

        // 3rd party package extensions
        ["^@ext"],

        // Inter-process communication
        ["^@cm-extension-ipc", "^@joplin-plugin-ipc"],

        // Joplin plugin
        ["^@joplin-plugin"],

        // Content script (Joplin -> CodeMirror)
        ["^@content-script"],

        // CodeMirror extension
        ["^@cm-extension"],

        // Test and test support
        ["^test"],

        // Absolute imports and other imports
        ["^"],

        // Relative imports (anything that starts with a dot)
        ["^\\."],
      ],
    },
  ],
}

const tsdocRules = {
  // Check TSDoc syntax for consistency
  "tsdoc/syntax": "error",
}

const typescriptEslintRules = {
  // Allow typescript namespaces for module-defined code organization and declaration merging
  "@typescript-eslint/no-namespace": "off",

  // Disallow `if (value)` checks which match `""`, `0`, and `NaN` to prevent potential bugs
  "@typescript-eslint/strict-boolean-expressions": [
    "error",
    {
      allowNullableObject: false,
      allowNumber: false,
      allowString: false,
    },
  ],

  // Disable specification of `public` on members for brevity
  "@typescript-eslint/explicit-member-accessibility": [
    "error",
    {
      accessibility: "no-public",
    },
  ],

  // Require explicit return and argument types on exported functions and class members
  // to define explicit interfaces that can't unintentionally change on refactor
  "@typescript-eslint/explicit-module-boundary-types": "error",
  "@typescript-eslint/explicit-function-return-type": [
    "error",
    {
      allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      allowExpressions: true,
    },
  ],

  // Define naming conventions for variables, etc.
  "@typescript-eslint/naming-convention": [
    "error",

    // Require strict camel case by default
    {
      selector: "default",
      format: ["strictCamelCase"],
      leadingUnderscore: "allow",
      trailingUnderscore: "allow",
    },

    // Allow pascal case for functions which mimic class constructors / factories
    {
      selector: "function",
      format: ["PascalCase", "strictCamelCase"],
    },

    // Disable for properties in object literals, since these are often library-defined
    {
      selector: "objectLiteralProperty",
      format: null,
    },

    // Allow properties to have underscores to represent `unused` and `reserved` identifiers
    {
      selector: "property",
      format: ["strictCamelCase"],
      leadingUnderscore: "allow",
      trailingUnderscore: "allow",
    },

    // Require types to be pascal case
    {
      selector: "typeLike",
      format: ["PascalCase"],
    },

    // Allow pascal case for variables that mimic singleton objects and class instances
    {
      selector: "variable",
      format: ["PascalCase", "strictCamelCase"],
      leadingUnderscore: "allow",
      trailingUnderscore: "allow",
    },

    // Allow pascal case for default and namespace imports
    {
      selector: "import",
      format: ["PascalCase", "strictCamelCase"],
    },
  ],

  // Allow unused vars that begin with an underscore
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

  // Require default parameters to be last to allow function calls to omit optional tail arguments
  "@typescript-eslint/default-param-last": "error",

  // Prevent overwriting declarations due to typos
  "@typescript-eslint/no-dupe-class-members": "error",

  // Prevent use of `this` outside classes and class-like objects where it may be undefined
  "@typescript-eslint/no-invalid-this": "error",

  // Disallow unsafe closures inside of loops
  "@typescript-eslint/no-loop-func": "error",

  // Disallow shadowing variables which can make code unintuitive and can lead to unexpected results
  "@typescript-eslint/no-shadow": "error",

  // Disallow unnecessary qualifiers for brevity
  "@typescript-eslint/no-unnecessary-qualifier": "error",

  // Require `readonly` on private class members that are never modified for clarity
  "@typescript-eslint/prefer-readonly": "error",

  // Disallow `Array#sort` without params since it performs an unintuitive lexicographical sort,
  // even for numbers (e.g. `[20, 10, 2].sort()` becomes `[10, 2, 20]` instead of `[2, 10, 20]`)
  "@typescript-eslint/require-array-sort-compare": "error",

  // Require type unions in switch statements to contain a case for every type in the union
  // to prevent overlooking necessary changes when adding new types
  "@typescript-eslint/switch-exhaustiveness-check": "error",
}

const unicornRules = {
  // Disallow mixing destructuring with direct property access of the (same) object for consistency
  "unicorn/consistent-destructuring": "error",

  // Require function definition at the highest scope possible for performance and readability
  "unicorn/consistent-function-scoping": "error",

  // Require `new` with built-ins for consistency (e.g. `new RegExp()` instead of `RegExp()`)
  "unicorn/new-for-builtins": "error",

  // Disallow use of `null` in favor of `undefined` for consistency, power, and less confusion
  "unicorn/no-null": "error",

  // Disallow use of `Array#indexOf` and `Array#some` when `Array#includes` is clearer
  "unicorn/prefer-includes": "error",

  // Disallow use of ternary operator when a logical operator serves the same purpose
  "unicorn/prefer-logical-operator-over-ternary": "error",

  // Prefer use of more-efficient and more-powerful DOM APIs
  "unicorn/prefer-modern-dom-apis": "error",

  // Prefer use of `String#trimStart/End` over `String#trimLeft/Right` since text direction varies
  "unicorn/prefer-string-trim-start-end": "error",

  // Prefer use of more descriptive and consistent `TypeError` over `Error` for type check failures
  "unicorn/prefer-type-error": "error",

  // Require explicit specification of separator in `Array#join` for clarity over the default of `,`
  "unicorn/require-array-join-separator": "error",

  // Require braces in non-empty cases of switch statements for clarity
  "unicorn/switch-case-braces": "error",

  // Require the use of `new` when throwing `Error`s for consistency
  "unicorn/throw-new-error": "error",
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ),
  {
    plugins: {
      tsdoc,
      "simple-import-sort": simpleImportSort,
      "@typescript-eslint": typescriptEslint,
      unicorn,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...eslintRules,
      ...simpleInputSortRules,
      ...tsdocRules,
      ...typescriptEslintRules,
      ...unicornRules,
    },
  },
]
