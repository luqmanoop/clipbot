import { Menu, shell, Tray } from 'electron';

import AppMenu from './menu';
import * as evt from './evt';

class ClipTray {
  constructor(trayIcon, win, bot) {
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('ClipBot');
    this.win = win;
    this.bot = bot;

    this.buildMenu();
    return this.tray;
  }

  buildMenu() {
    const win = this.win;
    const fakerMenu = AppMenu.getFakerMenu();

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'About ClipBot',
        click() {
          shell.openExternal('https://github.com/codeshifu/clipbot');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Clip fake data',
        submenu: [...fakerMenu]
      },
      {
        label: 'Show ClipBot',
        accelerator: 'CmdOrCtrl+Shift+C',
        click() {
          win.show();
        }
      },
      { type: 'separator' },
      {
        label: 'Clear clipboard',
        click() {
          if (!win.isVisible()) win.show();
          win.webContents.send(evt.CLEAR);
        }
      },
      {
        label: 'Help',
        click() {
          shell.openExternal('https://github.com/codeshifu/clipbot/issues');
        }
      },
      { type: 'separator' },
      {
        label: 'Quit ClipBot',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          if (!win.isVisible()) win.show();
          win.webContents.send(evt.QUIT);
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }
}

export default ClipTray;
