import { Notification } from 'electron';

class AppNotification {
  static show(obj = { title: 'ClipBot', body: 'Default notification body' }) {
    new Notification(obj).show();
  }
}

export default AppNotification;
