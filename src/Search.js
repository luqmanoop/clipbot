import React, { Component } from 'react';

import searchIcon from './assets/search.svg';

const { ipcRenderer } = window.require('electron');

class Search extends Component {
  constructor(props) {
    super(props);
    this.search = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp);
    this.search.current.addEventListener('focus', () =>
      this.handleFocusChange(true)
    );
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleFocusChange = (isFocused = false) => {
    if (!isFocused) {
      this.search.current.blur();
      this.search.current.classList.remove('focused');
      return;
    }

    this.search.current.focus();
    this.search.current.classList.add('focused');
  };

  handleKeyUp = e => {
    const { keyCode } = e;
    if (keyCode === 191) {
      this.handleFocusChange(true);
    } else if (keyCode === 27) {
      if (!this.search.current.classList.contains('focused')) {
        ipcRenderer.send('clip:hide');
        return;
      }
      this.handleFocusChange();
    }
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
