import React, { Component } from 'react';
import ClipItem from './ClipItem';
import Search from './Search';
import { clipboard } from './utils/clipboardManager';
import { numberKeys } from './utils/numberKeys';

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
    ipcRenderer.on('clip:add', this.addToClipboard);
    ipcRenderer.on('clip:scrollTop', () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
    ipcRenderer.on('clipboard:clear', () => {
      clipboard.clear().then(clippings => {
        this.setState({ clippings, searchResult: clippings });
      });
    });

    window.addEventListener('keyup', this.handleNumberKeyPressed);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleNumberKeyPressed);
  }

  handleNumberKeyPressed = ({ keyCode, key }) => {
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

  clipToClipboard(clip, oldClipIndex) {
    clipboard.remove(oldClipIndex);
    ipcRenderer.send('clip:focus', clip);
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
                  handleClick={() => this.clipToClipboard(item.clip, index)}
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
