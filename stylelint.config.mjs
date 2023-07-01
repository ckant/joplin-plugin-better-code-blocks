import standardConfig from "stylelint-config-standard"

const [standardClassPattern, standardMessage] = standardConfig.rules["selector-class-pattern"]
const builtInClassPattern = "^CodeMirror"
const oneOf = (...patterns) => patterns.map((it) => `(${it})`).join("|")

// noinspection JSUnusedGlobalSymbols
export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  rules: {
    "selector-class-pattern": [oneOf(standardClassPattern, builtInClassPattern), standardMessage],
  },
}
