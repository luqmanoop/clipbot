import { join } from 'path';
import serve from 'electron-serve';

import { app, clipboard, ipcMain, Menu } from 'electron';

import ClipBot from './clipbot';
import ClipTray from './clipTray';
import MainWindow from './mainWindow';

let win;
let bot;
let tray;

const trayIcon = join(__dirname, 'tray-icon.png');

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

  win = new MainWindow();
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    const loadURL = serve({ directory: 'build' });
    loadURL(win);
  }

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
