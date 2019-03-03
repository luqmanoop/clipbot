import React, { Component } from 'react';
import faker from 'faker';

import searchIcon from './assets/search.svg';
import ClipItem from './ClipItem';

class App extends Component {
  constructor(props) {
    super(props);
    this.search = React.createRef();

    const clipData = [];
    for (let index = 0; index < 10; index++) {
      clipData.push(faker.lorem.sentence());
    }

    this.state = {
      clipData,
      searchResult: [...clipData]
    };
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
    }
  };

  searchClipboard = e => {
    const searchQuery = e.target.value;
    const { clipData } = this.state;

    let searchResult = clipData.filter(clipItem => {
      return clipItem.toLowerCase().includes(searchQuery.toLowerCase());
    });

    this.setState({ searchResult });
  };

  render() {
    const placeholderText = 'Search clipboard (Press "/" to focus)';
    const { searchResult } = this.state;

    return (
      <div className="clipboard">
        <div className="search-wrapper">
          <img
            className="search-icon"
            src={searchIcon}
            alt="search icon"
            width="16"
          />
          <input
            ref={this.search}
            className="search-box"
            type="text"
            onChange={this.searchClipboard}
            placeholder={placeholderText}
          />
        </div>

        <div className="clipboard-items">
          {searchResult.length ? (
            searchResult.map((item, index) => {
              const props = { item, position: index + 1 };
              return <ClipItem key={index} {...props} />;
            })
          ) : (
            <p className="no-result">No result found</p>
          )}
        </div>
      </div>
    );
  }
}

export default App;
