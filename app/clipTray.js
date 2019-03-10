import { clipboard, Menu, Notification, shell, Tray, dialog } from 'electron';
import faker from 'faker';

import { trayFakerMenuWhitelist as menuWhitelist } from './utils';

class ClipTray {
  constructor(trayIcon, app, win) {
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('ClipBot');
    this.app = app;
    this.win = win;

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
    const showDialog = this.showDialog;

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
        click() {
          win.show();
        }
      },
      { type: 'separator' },
      {
        label: 'Clear clipboard',
        click() {
          if (!win.isVisible()) win.show();
          showDialog(
            win,
            'You are about to clear the clipboard',
            'All clipboard items will be permanently lost',
            ['Clear clipboard', 'Cancel'],
            indexOfClickedButton => {
              if (indexOfClickedButton === 0) {
                clipboard.clear();
                win.webContents.send('clipboard:clear');
              }
            }
          );
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
        click() {
          if (!win.isVisible()) win.show();
          showDialog(
            win,
            'Are you sure?',
            "ClipBot will stop collecting clippings if it isn't running",
            ['Quit', 'Cancel'],
            indexOfClickedButton => {
              if (indexOfClickedButton === 0) {
                win.destroy();
              }
            }
          );
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }
}

export default ClipTray;
