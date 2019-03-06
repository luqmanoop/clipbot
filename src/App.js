import React, { Component } from 'react';
import ClipItem from './ClipItem';
import Search from './Search';
import { clipboard } from './utils/clipboardManager';

const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);
    const clipData = clipboard.init();
    this.state = {
      clipData,
      searchResult: [...clipData]
    };
  }

  componentDidMount() {
    ipcRenderer.on('clip:add', this.addToClipboard);
  }

  addToClipboard = (e, clip) => {
    clipboard.add(clip).then(clipboardUpdate => {
      if (clipboardUpdate) {
        this.setState({
          clipData: clipboardUpdate,
          searchResult: clipboardUpdate
        });
      }
    });
  };

  searchClipboard = e => {
    const searchQuery = e.target.value;
    const { clipData } = this.state;

    let searchResult = clipData.filter(({ clip }) => {
      return clip.toLowerCase().includes(searchQuery.toLowerCase());
    });

    this.setState({ searchResult });
  };

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
              return <ClipItem key={item.createdAt} {...props} />;
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
