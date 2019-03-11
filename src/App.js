import React, { Component } from 'react';

import ClipItem from './ClipItem';
import Search from './Search';
import { clipboard } from './utils/clipboardManager';
import { numberKeys } from './utils/numberKeys';
import * as evt from './app/evt';

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

    window.addEventListener('keyup', this.handleNumpadPressed);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleNumpadPressed);
  }

  confirmAction = msg => window.confirm(msg);

  handleNumpadPressed = ({ target: elem, keyCode, key }) => {
    if (elem.target.classList.contains('search-box')) return;

    if (numberKeys[keyCode]) {
      const { clippings } = this.state;
      const clipIndex = key - 1;
      const { clip } = clippings[clipIndex];

      this.clipToClipboard(clip, clipIndex);
    }
  };

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

  clipToClipboard(clipItem) {
    clipboard.remove(clipItem);
    ipcRenderer.send(evt.CLIP_SELECTED, clipItem.clip);
  }

  render() {
    const { searchResult } = this.state;
    return (
      <div className="clipboard">
        <Search handleSearch={this.searchClipboard} />
        <div className="clipboard-items">
          {searchResult.length ? (
            searchResult.map((item, index) => {
              const position = index < 9 ? index + 1 : null;
              const props = { item, position };
              return (
                <ClipItem
                  key={item.createdAt}
                  {...props}
                  handleClick={() => this.clipToClipboard(item)}
                />
              );
            })
          ) : (
            <p className="no-result">No results found</p>
          )}
        </div>
      </div>
    );
  }
}

export default App;
