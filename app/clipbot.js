import { clipboard } from 'electron';

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
    this.win.webContents.send('clipboard:clear');
  }
}

export default ClipBot;
