import { app, clipboard, ipcMain, Menu } from 'electron';
import serve from 'electron-serve';
import { join } from 'path';

import ClipBot from './clipbot';
import ClipTray from './clipTray';
import MainWindow from './mainWindow';
import * as evt from './evt';

let win;
let bot;
let tray;

const trayIcon = join(__dirname, './icons/tray-icon.png');

const cleanup = () => {
  app.on('quit', () => {
    win = null;
    bot = null;
    tray = null;
  });

  win.on('closed', () => {
    win = null;
    app.quit();
  });
};

const launchOnSystemStartup = (app, launch) => {
  app.setLoginItemSettings({
    openAtLogin: launch
  });
};

const loadURL = serve({ directory: 'build' });

app.on('ready', () => {
  app.dock.hide();
  Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  win = new MainWindow();
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    loadURL(win);
  }

  bot = new ClipBot(app, win);
  tray = new ClipTray(trayIcon, win, bot);

  bot.watchClipboard(clip => {
    win.webContents.send(evt.ADD, { createdAt: Date.now(), clip });
  });

  ipcMain.on(evt.CLIP_SELECTED, (e, clip) => {
    app.hide();
    clipboard.writeText(clip);
  });

  ipcMain.on(evt.HIDE, app.hide);
  ipcMain.on(evt.QUIT_OK, (e, shouldQuit) => shouldQuit && bot.stopAndQuit());
  ipcMain.on(evt.CLEAR_OK, (e, shouldClear) => shouldClear && bot.clear());

  ipcMain.on(evt.LAUNCH_AT_LOGIN, (e, shouldLaunch) => {
    launchOnSystemStartup(app, shouldLaunch);
  });
  win.webContents.on('did-finish-load', () => {
    win.webContents.send(evt.LAUNCH_AT_LOGIN);
  });
  cleanup();
});
