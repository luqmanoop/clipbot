import React from 'react';
import { distanceInWordsToNow } from 'date-fns';

const ClipItem = ({ item: { clip, createdAt }, position, handleClick }) => {
  return (
    <div onClick={handleClick} className="clipboard-item">
      <div className="clip">
        <p>{clip}</p>
        <span>{position}</span>
      </div>
      <p className="createdAt">
        {distanceInWordsToNow(createdAt, { addSuffix: true })}
      </p>
    </div>
  );
};

export default ClipItem;
