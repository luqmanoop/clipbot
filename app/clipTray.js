import faker from 'faker';

import { Tray, Menu, shell, clipboard, Notification } from 'electron';

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

  buildMenu() {
    const win = this.win;
    const app = this.app;

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
        click() {
          win.show();
        }
      },
      { type: 'separator' },
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
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }
}

export default ClipTray;
