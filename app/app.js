import { app } from 'electron';
import MainWindow from './mainWindow';
import ClipBot from './clipbot';

let win;
let bot;

const cleanup = app => {
  app.on('quit', () => {
    win = null;
    bot = null;
  });
};

app.on('ready', () => {
  win = new MainWindow('http://localhost:3000');

  bot = new ClipBot(app);
  bot.watchClipboard(clip => {
    win.webContents.send('clip:add', clip);
  });

  cleanup(app);
});
