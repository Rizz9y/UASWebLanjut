import React from 'react';

const Hamburger = ({ onClick }) => {
  return (
    <button onClick={onClick} className="hamburger-btn" style={{ fontSize: '24px', margin: '10px' }}>
      ☰
    </button>
  );
};

export default Hamburger;
