# Soundboard

A configurable soundboard for desktop, built using Electron. Comes with two default soundboards: Arnold Schwarzenegger
and Donald Trump.

<img width="880" height="456" alt="Uncharted Waters: New Horizons" src="https://raw.githubusercontent.com/JohanLi/soundboard/readme-assets/screenshot.png">

#### Supported features when released

While still under development, the released version will support among other things:

* Dragging and dropping sounds and an interface for assigning them names and sections
* Shortcuts for switching to the soundboard while another application, eg. a game, is active
* Allow finding sounds quickly through a search input

#### Future vision (hard challenges)

* As it stands, if you want to route sounds to an audio input, you need to use an external program such as Virtual Audio
Cable. A goal would be to have this soundboard create its own virtual audio devices.
* Although being able to switch to the soundboard while in a game, this still causes some delay even when using windowed
mode. Could selecting sounds be done via voice, or through one's phone?

#### Setting up developer tools for React and Redux

A simple way to set up React Developer Tools and Redux DevTools for Electron is to use
[electron-devtools-installer](https://github.com/MarshallOfSound/electron-devtools-installer). Copy the code snippets
and run them once in the main process. The extensions will then be saved to `%appdata%/[name of app]/extensions`
and persist between restarts.
