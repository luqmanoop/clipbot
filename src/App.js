import React, { Component } from 'react';

import Search from './Search';
import { clipboard } from './utils/clipboardManager';
import * as evt from './app/evt';
import Clippings from './Clippings';

const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);
    const clippings = clipboard.init();
    this.state = {
      clippings,
      searchResult: [...clippings]
    };
  }

  componentDidMount() {
    ipcRenderer.on(evt.LAUNCH_AT_LOGIN, () => {
      const shouldLaunch = clipboard.getLaunchAtLogin();
      ipcRenderer.send(evt.LAUNCH_AT_LOGIN, shouldLaunch);
    });

    ipcRenderer.on(evt.UPDATE_LAUNCH_AT_LOGIN_STATUS, (e, launch) => {
      clipboard.setLaunchAtLogin(launch);
      ipcRenderer.send(evt.LAUNCH_AT_LOGIN, launch);
    });

    ipcRenderer.on(evt.ADD, this.addToClipboard);

    ipcRenderer.on(evt.SCROLL_TO_TOP, () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    ipcRenderer.on(evt.CLEAR_OK, () => {
      clipboard.clear().then(clippings => {
        this.setState({ clippings, searchResult: clippings });
      });
    });

    ipcRenderer.on(evt.QUIT, () =>
      ipcRenderer.send(
        evt.QUIT_OK,
        this.confirmAction(
          "Are you sure?\nClipBot will stop collecting clippings if it isn't running"
        )
      )
    );

    ipcRenderer.on(evt.CLEAR, () =>
      ipcRenderer.send(
        evt.CLEAR_OK,
        this.confirmAction(
          'You are about to clear the clipboard\nAll clipboard items will be permanently lost'
        )
      )
    );

    ipcRenderer.on(evt.FOCUS_RESET, () => {
      const { clippings } = this.state;
      this.setState({ searchResult: clippings });
    });
  }

  confirmAction = msg => window.confirm(msg);

  addToClipboard = (e, clipping) => {
    if (!clipping.clip || !clipping.clip.length) return;

    clipboard.add(clipping).then(clipboardUpdate => {
      if (clipboardUpdate) {
        this.setState({
          clippings: clipboardUpdate,
          searchResult: clipboardUpdate
        });
      }
    });
  };

  searchClipboard = e => {
    const searchQuery = e.target.value;
    const { clippings } = this.state;

    let searchResult = clippings.filter(({ clip }) => {
      return clip.toLowerCase().includes(searchQuery.toLowerCase());
    });

    this.setState({ searchResult });
  };

  render() {
    const { searchResult, clippings } = this.state;
    return (
      <div className="clipboard">
        <Search handleSearch={this.searchClipboard} />
        <Clippings data={{ searchResult, clippings }} />
      </div>
    );
  }
}

export default App;
