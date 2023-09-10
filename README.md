<h1 align="center">
  <img alt="logo" src="https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/logo.svg" width="100">
  <br>
  Better Code Blocks
  <br>
</h1>

<h4 align="center"><a href="https://joplinapp.org">Joplin plugin</a> that enhances code blocks with inline rendering, autocompletion, and more</h4>

<p align="center">
  <a href="https://discourse.joplinapp.org/t/plugin-better-code-blocks/32613">
    <img alt="Joplin Plugin" src="https://img.shields.io/npm/v/joplin-plugin-better-code-blocks?logo=joplin&label=plugin&color=1071D3&style=flat-square" />
  </a>
  <a href="https://github.com/ckant/joplin-plugin-better-code-blocks/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-549E6A?style=flat-square" />
  </a>
  <a href="https://app.codecov.io/github/ckant/joplin-plugin-better-code-blocks">
    <img alt="Coverage" src="https://img.shields.io/codecov/c/github/ckant/joplin-plugin-better-code-blocks?logo=codecov&style=flat-square" />
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#download">Download</a> •
  <a href="#settings">Settings</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

<div align="center"><img src="https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/preview.gif" alt="preview" width="87%"></div>

## Features

- Renders code blocks inline with `Minimal` or `Standard` styles
- Adds `copy` button for inline code blocks
- Autocompletes code blocks on <kbd>Enter</kbd>
- Changes <kbd>Select All</kbd> to select the current code block

## Screenshots

![minimal layout](https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/minimal%20layout.png)
![standard layout](https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/standard%20layout.png)
![settings](https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/settings.png)

## Download

Search for `Better Code Blocks` in the Joplin settings under the `Plugins` section.

## Settings

| Setting                                             | Options                             | Description                                                                           |
| --------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| Autocompletion                                      | `Enabled`, `Disabled`               | Enables/disables automatic completion of code blocks when <kbd>Enter</kbd> is pressed |
| Rendering                                           | `Enabled`, `Disabled`               | Enables/disables rendering of code blocks                                             |
| Behavior of <kbd>Select All</kbd> inside code block | `Enabled`, `Disabled`               | Changes the behavior of <kbd>Select All</kbd> while the cursor is inside code blocks  |
| Render layout                                       | `Minimal`, `Standard`               | Changes the layout of rendered code blocks                                            |
| Corner style                                        | `Square`, `Round`                   | Changes the border style of rendered code blocks                                      |
| Excluded languages                                  | `(comma-separated list)`            | Disables rendering of code blocks for specific languages                              |
| Copy button behavior                                | `Copy code`, `Copy code and fences` | Controls what's copied when the <kbd>Copy Code</kbd> button is clicked                |

## Credits

- [Joplin](https://joplinapp.org)
- [CodeMirror](http://codemirror.net/)

## License

Copyright © 2023 [Chris Kant](https://github.com/ckant).<br />
This project is [MIT](https://github.com/ckant/joplin-plugin-better-code-blocks/blob/main/LICENSE) licensed.
