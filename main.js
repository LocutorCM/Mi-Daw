const { app, BrowserWindow } = require('electron');
function createWindow(){
  const win = new BrowserWindow({ width: 1400, height: 900, backgroundColor: '#1a1a1a' });
  win.loadFile('index.html');
}
app.whenReady().then(createWindow);
