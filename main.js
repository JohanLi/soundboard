const { app, BrowserWindow, globalShortcut } = require('electron');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    frame: false,
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL('http://localhost:8080');
  } else {
    mainWindow.loadURL(`file://${__dirname}/public/index.html`);
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  globalShortcut.register('CommandOrControl+Space', () => {
    mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
