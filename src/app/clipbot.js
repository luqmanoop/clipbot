import { clipboard } from 'electron';
import * as evt from './evt';

class ClipBot {
  constructor(app, win) {
    this.clipboard = clipboard;
    this.watchHandler = null;
    this.app = app;
    this.win = win;
  }

  watchClipboard(cb) {
    this.watchHandler = setInterval(() => {
      cb(this.clipboard.readText());
    }, 1000);
  }

  stopAndQuit() {
    clearInterval(this.watchHandler);
    this.app.quit();
  }

  clear() {
    this.clipboard.clear();
    this.win.webContents.send(evt.CLEAR_OK);
  }
}

export default ClipBot;
