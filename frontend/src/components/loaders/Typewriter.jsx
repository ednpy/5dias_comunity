import React from 'react';
import './Typewriter.css';

const Typewriter = () => {
  return (
    <div className="typewriter">
      <div className="slide"><i></i></div>
      <div className="paper"></div>
      <div className="keyboard"></div>
    </div>
  );
};

export default Typewriter;