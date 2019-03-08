import faker from 'faker';

import { Tray, Menu, shell, clipboard, Notification } from 'electron';

import { trayFakerMenuWhitelist as menuWhitelist } from './utils';

class ClipTray {
  constructor(trayIcon, app) {
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('ClipBot');
    this.buildMenu();
    this.app = app;

    return this.tray;
  }

  menuFilter(menuObj) {
    return Object.getOwnPropertyNames(menuObj).filter(menu =>
      menuWhitelist.includes(menu)
    );
  }

  showNotification = () => {
    if (Notification.isSupported()) {
      new Notification({
        title: 'ClipBot',
        body: 'copied to clipboard!'
      }).show();
    }
  };

  buildMenu() {
    const notify = this.showNotification;

    const fakerMenu = this.menuFilter(faker).map(menu => {
      return {
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
      };
    });

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Clip fake data',
        submenu: [...fakerMenu]
      },
      { type: 'separator' },
      {
        label: 'About',
        click() {
          shell.openExternal('https://github.com/codeshifu/clipbot');
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
          this.app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }
}

export default ClipTray;
