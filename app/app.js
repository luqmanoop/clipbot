import { app, ipcMain, clipboard, Tray, Menu, shell } from 'electron';
import { join } from 'path';

import MainWindow from './mainWindow';
import ClipBot from './clipbot';

let win;
let bot;
let tray;

const cleanup = app => {
  app.on('quit', () => {
    win = null;
    bot = null;
  });
};

app.on('ready', () => {
  app.dock.hide();
  tray = new Tray(join(__dirname, './icon.png'));
  tray.setToolTip('ClipBot');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Help',
      click() {
        shell.openExternal('https://github.com/codeshifu/clip-bot');
      }
    },
    { type: 'separator' },
    {
      label: 'Quit ClipBot',
      click() {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  win = new MainWindow('http://localhost:3000');

  bot = new ClipBot(app);
  bot.watchClipboard(clip => {
    win.webContents.send('clip:add', { createdAt: Date.now(), clip });
  });

  ipcMain.on('clip:focus', (e, clip) => {
    app.hide();
    clipboard.writeText(clip);
  });

  cleanup(app);
});
