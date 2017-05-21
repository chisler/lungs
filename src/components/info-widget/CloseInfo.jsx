import React from "react";

import "./close_info.css"

const CloseInfo = (props) => {
  const handleClick = props.onCloseInfo;

  return <a
    href="#"
    className="close-button"
    onClick={handleClick}
  >x</a>
};

export default CloseInfo;