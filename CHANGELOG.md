# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/ckant/joplin-plugin-better-code-blocks/compare/v2.0.2...HEAD)

## [2.0.2](https://github.com/ckant/joplin-plugin-better-code-blocks/compare/v2.0.1...v2.0.2) - 2026-02-05

### Fixed

- Compatibility with the newish Joplin `Render markup in editor` option
- Compatibility with plugins that wrap the default markdown CodeMirror language in another one
  - e.g. The `Inline Tag Navigator` plugin wraps markdown in yaml to support yaml frontmatter

## [2.0.1](https://github.com/ckant/joplin-plugin-better-code-blocks/compare/v2.0.0...v2.0.1) - 2025-03-21

### Fixed

- Issue running with legacy editor due to missing CodeMirror 6 dependencies

## [2.0.0](https://github.com/ckant/joplin-plugin-better-code-blocks/compare/v1.1.0...v2.0.0) - 2024-11-25

### Added

- Support for CodeMirror 6
  - Native autocomplete for given languages
  - Cursor placement before and after code blocks to simplify adding /removing line breaks
  - Some tricks to prevent accidental deletion of code blocks
  - Branching logic to choose between CodeMirror 5 and 6

### Fixed

- CodeMirror 5 implementation leniency with 1-3 tab characters at the start of code fences

### Changed

- Update dependencies

## [1.1.0](https://github.com/ckant/joplin-plugin-better-code-blocks/compare/v1.0.0...v1.1.0) - 2023-09-10

### Added

- Continuous integration and publishing workflows for GitHub
- This CHANGELOG.md

### Fixed

- Re-render during initialization
- Unintentional instance of coupling from `@ext` to `@cm-extension`

### Changed

- Style injection to happen before first render
- Badges, logo, and formatting in README.md
- Lint script to run all linters, rather than just ESLint

## [1.0.0](https://github.com/ckant/joplin-plugin-better-code-blocks/releases/tag/v1.0.0) - 2023-09-08

### Added

- Initial release