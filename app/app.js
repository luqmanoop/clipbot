import { join } from 'path';

import { app, clipboard, ipcMain, Menu } from 'electron';

import ClipBot from './clipbot';
import ClipTray from './clipTray';
import MainWindow from './mainWindow';

let win;
let bot;
let tray;

const trayIcon = join(__dirname, 'tray-icon.png');

console.log(trayIcon);

const cleanup = app => {
  app.on('quit', () => {
    win = null;
    bot = null;
    tray = null;
  });
};

app.on('ready', () => {
  app.dock.hide();
  Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  win = new MainWindow('http://localhost:3000');
  tray = new ClipTray(trayIcon, app, win);

  bot = new ClipBot(app);
  bot.watchClipboard(clip => {
    win.webContents.send('clip:add', { createdAt: Date.now(), clip });
  });

  ipcMain.on('clip:focus', (e, clip) => {
    app.hide();
    clipboard.writeText(clip);
  });

  ipcMain.on('clip:hide', app.hide);

  cleanup(app);
});
