const { app, BrowserWindow } = require('electron');

function createWindow() {
  const [ width, height ] = [1440, 900];
  let win = new BrowserWindow({
    minWidth: width,
    minHeight: height,
    maxWidth: width,
    maxHeight: height,
    nodeIntegration: true,
  });
  win.setMenuBarVisibility(false);
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();
})