const { app, BrowserWindow } = require('electron');
const path = require('path');
function createWindow(){
  const win = new BrowserWindow({
    width: 1400, height: 900,
    backgroundColor: '#ffffff',
    show: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.on('did-fail-load', () => {
    win.loadURL('data:text/html,<h1>NO ENCONTRO index.html</h1>');
  });
}
app.whenReady().then(createWindow);
