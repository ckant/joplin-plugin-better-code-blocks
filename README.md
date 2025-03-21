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
  <a href="https://discourse.joplinapp.org/t/plugin-better-code-blocks/32613">
    <img alt="Downloads" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fckant%2Fjoplin-plugin-stats%2Frefs%2Fheads%2Fmain%2Fdownloads.json&query=%24%5Bcom.ckant.joplin-plugin-better-code-blocks%5D&style=flat-square&label=downloads&color=0D98ba" />
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

<div align="center"><img src="https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/preview.gif" alt="preview" width="88%"></div>

## Features

- Renders code blocks inside the editor pane (rather than only inside the preview pane)
- Adds `copy` button for code blocks inside the editor pane
- Autocompletes code blocks
- Changes <kbd>Select All</kbd> to select the current code block
- Performs some tricks to prevent accidental deletion of code blocks
- Supports both legacy (CM5) and new (CM6) markdown editor

## Screenshots

![minimal layout](https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/minimal%20layout.png)
![standard layout](https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/standard%20layout.png)
![settings](https://raw.githubusercontent.com/ckant/joplin-plugin-better-code-blocks/main/media/settings.png)

## Download

Search for `Better Code Blocks` in the Joplin settings under the `Plugins` section.

## Settings

| Setting                                             | Options                                          | Description                                                                           |
|-----------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------------|
| Autocompletion                                      | `Enabled`, `Disabled`                            | Enables/disables automatic completion of code blocks when <kbd>Enter</kbd> is pressed |
| Rendering                                           | `Enabled`, `Disabled`                            | Enables/disables rendering of code blocks                                             |
| Behavior of <kbd>Select All</kbd> inside code block | `Select current code block`, `Select everything` | Changes the behavior of <kbd>Select All</kbd> while the cursor is inside code blocks  |
| Render layout                                       | `Minimal`, `Standard`                            | Changes the layout of rendered code blocks                                            |
| Corner style                                        | `Square`, `Round`                                | Changes the border style of rendered code blocks                                      |
| Copy button behavior                                | `Copy code`, `Copy code and fences`              | Controls what's copied when the <kbd>Copy Code</kbd> button is clicked                |
| Autocompleted languages (new CM6 editor only)       | `(comma-separated list)`                         | Enables native autocompletion for the given languages                                 |
| Excluded languages                                  | `(comma-separated list)`                         | Disables rendering of code blocks for specific languages                              |

## Credits

- [Joplin](https://joplinapp.org)
- [CodeMirror](http://codemirror.net/)

## License

Copyright © 2023 [Chris Kant](https://github.com/ckant).<br />
This project is [MIT](https://github.com/ckant/joplin-plugin-better-code-blocks/blob/main/LICENSE) licensed.
