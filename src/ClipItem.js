import React from 'react';
import { distanceInWordsToNow } from 'date-fns';
const ClipItem = ({ item: { clip, createdAt }, position }) => {
  return (
    <div className="clipboard-item">
      <div className="clip">
        <p>{clip}</p>
        <span>{position}</span>
      </div>
      <p className="createdAt">{distanceInWordsToNow(createdAt)}</p>
    </div>
  );
};

export default ClipItem;
