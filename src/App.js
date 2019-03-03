import React, { Component } from 'react';
import faker from 'faker';

class App extends Component {
  render() {
    return (
      <div>
        { faker.finance.account() }
      </div>
    );
  }
}

export default App;
