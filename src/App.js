import React, { Component } from 'react';
import faker from 'faker';

import searchIcon from './assets/search.svg';

class App extends Component {
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
    }
  };

  render() {
    const placeholderText = 'Search clipboard (Press "/" to focus)';

    return (
      <div className="clipboard">
        <div className="search-wrapper">
          <img className="search-icon" src={searchIcon} alt="search icon" width="16" />
          <input
            ref={this.search}
            className="search-box"
            type="text"
            placeholder={placeholderText}
          />
        </div>

        <div className="clipboard-items">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
            <div key={item} className="clipboard-item">
              <p>{faker.lorem.sentence()}</p>
              <span>{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
