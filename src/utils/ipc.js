import * as evt from '../app/evt';
import { clipboard } from './clipboardManager';

const { ipcRenderer } = window.require('electron');

class IPC {
  registerEvents() {
    ipcRenderer.on(evt.LAUNCH_AT_LOGIN, () => {
      const shouldLaunch = clipboard.getLaunchAtLogin();
      ipcRenderer.send(evt.LAUNCH_AT_LOGIN, shouldLaunch);
    });

    ipcRenderer.on(evt.UPDATE_LAUNCH_AT_LOGIN_STATUS, (e, launch) => {
      clipboard.setLaunchAtLogin(launch);
      ipcRenderer.send(evt.LAUNCH_AT_LOGIN, launch);
    });

    ipcRenderer.on(evt.SCROLL_TO_TOP, () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    ipcRenderer.on(evt.CLEAR, () =>
      ipcRenderer.send(
        evt.CLEAR_OK,
        this.confirmAction(
          'You are about to clear the clipboard\nAll clipboard items will be permanently lost'
        )
      )
    );

    ipcRenderer.on(evt.QUIT, () =>
      ipcRenderer.send(
        evt.QUIT_OK,
        this.confirmAction(
          "Are you sure?\nClipBot will stop collecting clippings if it isn't running"
        )
      )
    );
  }
  confirmAction = msg => window.confirm(msg);

  static onClearOk(cb) {
    ipcRenderer.on(evt.CLEAR_OK, () => {
      clipboard.clear().then(cb);
    });
  }

  static onFocusReset(cb) {
    ipcRenderer.on(evt.FOCUS_RESET, cb);
  }

  static onClipboardAdd(cb) {
    ipcRenderer.on(evt.ADD, cb);
  }
}

export default IPC;
