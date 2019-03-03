import React from 'react';

const ClipItem = ({ item, position }) => {
  return (
    <div className="clipboard-item">
      <p>{item}</p>
      <span>{position}</span>
    </div>
  );
};

export default ClipItem;
