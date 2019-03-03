import React, { Component } from 'react';

import searchIcon from './assets/search.svg';

class Search extends Component {
  constructor(props) {
    super(props);
    this.search = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp = e => {
    const { keyCode } = e;
    if (keyCode === 191) {
      this.search.current.focus();
    } else if (keyCode === 27) {
      this.search.current.blur();
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
