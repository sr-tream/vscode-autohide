## *Requires Visual Studio Code, version 1.43 or higher

# Auto Hide

Extension install page: <https://marketplace.visualstudio.com/items?itemName=sr-team.vscode-autohide>

## Features

### Auto-hide side bar
Causes the side bar to be hidden whenever the user clicks into the text editor.

![Auto-hide side bar](Images/Features/AutoHideSideBar.gif)

### Auto-hide bottom panel
Same thing as above, except for the bottom panel (output, terminal, etc. are contained in the panel).

### Fork differences
- Fixed clicks in output window
- Added option to disable auto hide during debugging
- Change logic from close primary side bar to close left/right side bars
- Removed auto hide delay 

## Settings

* `autoHide.autoHideRightSideBar`: Hide the right side bar when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.autoHideLeftSideBar`: Hide the left side bar when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.autoHidePanel`: Hide the panel (output, terminal, etc.) when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.autoHideReferences`: Hide the References panel (`Go to References`) when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.hideOnOpen`: Hide side bars and panel when VSCode first opens. [boolean, default: `true`]
* `autoHide.hideOnDebug`: Hide side bars and panel when the user clicks into a text editor in debug mode. [boolean, default: `true`]

## Commands

* `autoHide.toggleHideRightSideBar`: Toggle `autoHide.toggleHideRightSideBar` setting for current workspace. Use this command to pin/unpin the right side bar.
* `autoHide.toggleHideLeftSideBar`: Toggle `autoHide.toggleHideLeftSideBar` setting for current workspace. Use this command to pin/unpin the left side bar.
* `autoHide.toggleHidePanel`: Toggle `autoHide.autoHidePanel` setting for current workspace. Use this command to pin/unpin the panel.
* `autoHide.toggleHideOnDebug`: Toggle `autoHide.toggleHideOnDebug` setting for current workspace.

## Developing

1) Clone/download repo: https://github.com/sr-tream/vscode-autohide.git
2) Make code changes in "src" folder.
3) Run "npm run compile". (this will start compiler in watch mode) [if editing in vscode, Ctrl+Shift+B also works]
4) In vscode, open the Debug panel and launch the extension from there.

## Publishing

https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## Credit to 'VTools for Visual Studio Code'

This extension is a heavily modified version of:
<https://marketplace.visualstudio.com/items?itemName=venryx.vscode-vtools>