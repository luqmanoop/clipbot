import { clipboard, Menu, Notification, shell, Tray, dialog } from 'electron';
import faker from 'faker';

import { trayFakerMenuWhitelist as menuWhitelist } from './utils';

class ClipTray {
  constructor(trayIcon, win, bot) {
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('ClipBot');
    this.win = win;
    this.bot = bot;

    this.buildMenu();
    return this.tray;
  }

  menuFilter(menuObj) {
    return Object.getOwnPropertyNames(menuObj).filter(menu =>
      menuWhitelist.includes(menu)
    );
  }

  showNotification() {
    if (Notification.isSupported()) {
      new Notification({
        title: 'ClipBot',
        body: 'copied to clipboard!'
      }).show();
    }
  }

  getFakerMenu() {
    const notify = this.showNotification;
    return this.menuFilter(faker).map(menu => ({
      label: menu,
      submenu: [
        ...this.menuFilter(faker[menu]).map(subMenu => ({
          label: subMenu,
          click() {
            const fakeData = faker[menu][subMenu]();
            clipboard.writeText(fakeData);
            notify();
          }
        }))
      ]
    }));
  }

  showDialog(win, message, detail, buttons, cb, type = 'warning') {
    win.setSheetOffset(-100);
    dialog.showMessageBox(
      win,
      {
        type,
        message,
        detail,
        buttons,
        cancelId: 1
      },
      cb
    );
  }

  buildMenu() {
    const win = this.win;
    const fakerMenu = this.getFakerMenu();

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
          win.webContents.send('clear:clipboard');
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
          win.webContents.send('app:quit');
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }
}

export default ClipTray;
