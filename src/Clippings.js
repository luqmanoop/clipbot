import React, { Component } from 'react';
import ClipItem from './ClipItem';
import { clipboard } from './utils/clipboardManager';
import { numberKeys } from './utils/numberKeys';
import * as evt from './app/evt';

const { ipcRenderer } = window.require('electron');

class Clippings extends Component {
  componentDidMount() {
    window.addEventListener('keyup', this.handleNumpadPressed);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleNumpadPressed);
  }

  handleNumpadPressed = ({ target: elem, keyCode, key }) => {
    if (elem.classList.contains('search-box')) return;

    if (numberKeys[keyCode]) {
      const {
        data: { clippings }
      } = this.props;
      const clipIndex = key - 1;
      const clipItem = clippings[clipIndex];

      this.clipToClipboard(clipItem);
    }
  };

  clipToClipboard(clipItem) {
    clipboard.remove(clipItem);
    ipcRenderer.send(evt.CLIP_SELECTED, clipItem.clip);
  }

  render() {
    const {
      data: { searchResult }
    } = this.props;
    return (
      <div className="clipboard-items">
        {searchResult.length ? (
          searchResult.map((item, index) => {
            const position = index < 9 ? index + 1 : null;
            const props = { item, position };
            return (
              <ClipItem
                key={item.createdAt}
                {...props}
                handleClick={() => this.clipToClipboard(item)}
              />
            );
          })
        ) : (
          <p className="no-result">No results found</p>
        )}
      </div>
    );
  }
}

export default Clippings;
