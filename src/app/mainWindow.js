import { BrowserWindow, globalShortcut } from 'electron';
import * as evt from './evt';

class MainWindow {
  constructor() {
    const WINDOW_WIDTH = 500;
    const WINDOW_HEIGHT = 450;

    this.win = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      frame: false,
      resizable: false,
      show: false,
      webPreferences: { backgroundThrottling: false }
    });

    // Open on whichever Space (desktop) is active, instead of switching
    // back to the Space where the window was first shown. The window hides
    // on blur, so it never lingers on other Spaces.
    // Floating and not full-screenable lets it also show over a full-screen
    // app's Space. This only works if the Dock icon is hidden after this
    // runs (see app.js).
    this.win.setAlwaysOnTop(true, 'floating');
    this.win.setVisibleOnAllWorkspaces(true);
    this.win.setFullScreenable(false);

    this.registerGlobalShortcuts();

    this.win.on('blur', this.win.hide);
    this.win.on('focus', () => {
      this.win.webContents.send(evt.SCROLL_TO_TOP);
    });

    return this.win;
  }

  registerGlobalShortcuts() {
    globalShortcut.register('CmdOrCtrl+Shift+C', () => {
      this.win.show();
      this.win.webContents.send(evt.FOCUS_RESET);
    });
  }
}

export default MainWindow;
