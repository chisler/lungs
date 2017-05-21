import React from "react";

import "./close_info.css";

const CloseInfo = props => {
  const handleClick = props.onCloseInfo;

  return (
    <div>
      <a href="#" className="close-button" onClick={handleClick}>x</a>
    </div>
  );
};

export default CloseInfo;
