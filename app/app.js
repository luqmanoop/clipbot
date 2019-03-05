import { app, BrowserWindow, globalShortcut } from 'electron';

let win;
app.on('ready', () => {
  globalShortcut.register('CmdOrCtrl+Shift+C', () => {
    win.show();
  });

  win = new BrowserWindow({
    width: 450,
    height: 400,
    frame: false,
    resizable: false,
    show: false
  });

  win.loadURL('http://localhost:3000');
  win.on('closed', () => {
    win = null;
  });
});
