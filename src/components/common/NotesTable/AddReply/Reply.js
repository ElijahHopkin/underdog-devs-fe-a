import React from 'react';
import './Reply.css';

const ReplyInput = props => {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn">close</button>
        {props.children}
      </div>
    </div>
  ) : (
    ''
  );
};

export default ReplyInput;
