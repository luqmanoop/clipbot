import { clipboard } from 'electron';

class ClipBot {
  constructor(app) {
    this.clipboard = clipboard;
  }

  watchClipboard(cb) {
    setInterval(() => {
      cb(this.clipboard.readText());
    }, 1500);
  }
}

export default ClipBot;
