import React, { Component } from 'react';
import faker from 'faker';

import ClipItem from './ClipItem';
import Search from './Search';

class App extends Component {
  constructor(props) {
    super(props);
    
    const clipData = [];
    for (let index = 0; index < 10; index++) {
      clipData.push(faker.lorem.sentence());
    }

    this.state = {
      clipData,
      searchResult: [...clipData]
    };
  }

  searchClipboard = e => {
    const searchQuery = e.target.value;
    const { clipData } = this.state;

    let searchResult = clipData.filter(clipItem => {
      return clipItem.toLowerCase().includes(searchQuery.toLowerCase());
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
              return <ClipItem key={index} {...props} />;
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
