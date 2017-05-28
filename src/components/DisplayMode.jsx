import React from "react";

import {
  D3container,
  HeaderContainer,
  InfoContainer
} from "../containers";

import "./App.css";

const DisplayMode = () => {
  return (
    <div>
      <HeaderContainer />
      <div className="container">
        <div className="left">
          <D3container />
        </div>
        <div className="right"> 
          <InfoContainer />
        </div>
      </div>
    </div>
  );
};

export default DisplayMode;
