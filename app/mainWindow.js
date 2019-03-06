import { BrowserWindow, globalShortcut } from 'electron';

class MainWindow {
  constructor(url) {
    this.win = new BrowserWindow({
      width: 450,
      height: 400,
      center: true,
      frame: false,
      resizable: false,
      show: false,
      webPreferences: { backgroundThrottling: false }
    });

    this.win.loadURL(url);
    this.registerGlobalShortcuts();
    this.win.on('blur', this.win.hide);
    return this.win;
  }

  registerGlobalShortcuts() {
    globalShortcut.register('CmdOrCtrl+Shift+C', () => {
      this.win.show();
    });
  }
}

export default MainWindow;
