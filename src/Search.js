import React, { Component } from 'react';
import searchIcon from './assets/search.svg';
import * as evt from './app/evt';
import IPC from './utils/ipc';

const { ipcRenderer } = window.require('electron');

class Search extends Component {
  constructor(props) {
    super(props);
    this.search = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp);
    this.searchElem().addEventListener('focus', () =>
      this.handleFocusChange(true)
    );

    IPC.onFocusReset(() => {
      this.searchElem().value = '';
      this.handleFocusChange();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  searchElem = () => this.search.current;

  handleKeyUp = e => {
    const { keyCode } = e;
    if (keyCode === 191) {
      this.handleFocusChange(true);
    } else if (keyCode === 27) {
      if (!this.searchElem().classList.contains('focused')) {
        ipcRenderer.send(evt.HIDE);
        return;
      }
      this.handleFocusChange();
    }
  };

  handleFocusChange = (isFocused = false) => {
    if (!isFocused) {
      this.searchElem().value = '';
      this.searchElem().blur();
      this.searchElem().classList.remove('focused');
      this.props.onSearchBlur();
      return;
    }

    this.searchElem().focus();
    this.searchElem().classList.add('focused');
    this.props.onSearchFocus();
  };

  render() {
    const placeholderText = 'Search clipboard (Press "/" to focus)';
    const { handleSearch } = this.props;
    return (
      <div className="search-wrapper">
        <img
          className="search-icon"
          src={searchIcon}
          alt="search icon"
          width="16"
        />
        <input
          className="search-box"
          type="text"
          ref={this.search}
          onChange={handleSearch}
          placeholder={placeholderText}
        />
      </div>
    );
  }
}

export default Search;
