import { clipboard } from 'electron';
import faker from 'faker';

import { trayFakerMenuWhitelist as menuWhitelist } from './utils';
import Notification from './notification';

class AppMenu {
  static menuFilter(menuObj) {
    return Object.getOwnPropertyNames(menuObj).filter(menu =>
      menuWhitelist.includes(menu)
    );
  }

  static getFakerMenu() {
    return AppMenu.menuFilter(faker).map(menu => ({
      label: menu,
      submenu: [
        ...AppMenu.menuFilter(faker[menu]).map(subMenu => ({
          label: subMenu,
          click() {
            const fakeData = faker[menu][subMenu]();
            clipboard.writeText(fakeData);
            Notification.show({
              title: 'ClipBot',
              body: 'copied to clipboard'
            });
          }
        }))
      ]
    }));
  }
}

export default AppMenu;
