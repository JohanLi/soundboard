### Setting up developer tools for React and Redux

A simple way to set up React Developer Tools and Redux DevTools for Electron is to use
[electron-devtools-installer](https://github.com/MarshallOfSound/electron-devtools-installer). Copy the code snippets
and run them once in the main process. The extensions will then be saved to `%appdata%/[name of app]/extensions`
and persist between restarts.
