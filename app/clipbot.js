import { clipboard } from 'electron';

class ClipBot {
  constructor(app) {
    this.clipboard = clipboard;
  }

  watchClipboard(cb) {
    setInterval(() => {
      cb(this.clipboard.readText());
    }, 1000);
  }
}

export default ClipBot;
