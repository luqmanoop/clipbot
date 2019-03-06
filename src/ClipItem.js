import React from 'react';
import { distanceInWordsToNow } from 'date-fns';

const ClipItem = props => {
  const {
    item: { clip, createdAt },
    position,
    handleClick
  } = props;

  return (
    <div
      data-position={position}
      data-clip={`${clip}`}
      onClick={handleClick}
      className="clipboard-item"
    >
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
