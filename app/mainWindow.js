import { BrowserWindow, globalShortcut } from 'electron';

class MainWindow {
  constructor() {
    const WINDOW_WIDTH = 450;
    const WINDOW_HEIGHT = 400;

    this.win = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      frame: false,
      resizable: false,
      show: false,
      webPreferences: { backgroundThrottling: false }
    });

    this.registerGlobalShortcuts();

    this.win.on('blur', this.win.hide);
    this.win.on('focus', () => {
      this.win.webContents.send('clip:scrollTop');
    });

    return this.win;
  }

  registerGlobalShortcuts() {
    globalShortcut.register('CmdOrCtrl+Shift+C', () => {
      this.win.show();
    });
  }
}

export default MainWindow;
