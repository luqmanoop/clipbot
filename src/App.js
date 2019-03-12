import React, { Component } from 'react';

import Search from './Search';
import { clipboard } from './utils/clipboardManager';
import Clippings from './Clippings';
import IPC from './utils/ipc';

class App extends Component {
  constructor(props) {
    super(props);
    const clippings = clipboard.init();
    this.state = {
      clippings,
      searchResult: [...clippings],
      searchFocus: false
    };
  }

  componentDidMount() {
    const ipc = new IPC();
    ipc.registerEvents();

    IPC.onClipboardAdd(this.addToClipboard);

    IPC.onFocusReset(() => this.resetSearchResult);

    IPC.onClearOk(clippings => {
      this.setState({ clippings, searchResult: clippings });
    });
  }

  addToClipboard = (e, clipping) => {
    if (!clipping.clip || !clipping.clip.length) return;
    const { searchFocus } = this.state;
    clipboard.add(clipping).then(clippingsUpdate => {
      if (clippingsUpdate && !searchFocus) {
        return this.setState({
          clippings: clippingsUpdate,
          searchResult: clippingsUpdate
        });
      }

      this.setState({ clippings: clippingsUpdate });
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

  handleSearchFocus = () => this.setState({ searchFocus: true });

  resetSearchResult = () => {
    const { clippings } = this.state;
    this.setState({ searchResult: clippings, searchFocus: false });
  };

  render() {
    const { searchResult, clippings } = this.state;
    return (
      <div className="clipboard">
        <Search
          handleSearch={this.searchClipboard}
          onSearchBlur={this.resetSearchResult}
          onSearchFocus={this.handleSearchFocus}
        />
        <Clippings data={{ searchResult, clippings }} />
      </div>
    );
  }
}

export default App;
