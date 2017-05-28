import React from "react";

import {
  EditorContainer,
  SortedErrors,
  D3container,
  HeaderContainer,
  InfoContainer,
  GitHubContainer
} from "../containers";

import "./App.css";

const EditorMode = () => {
  return (
    <div>
      <GitHubContainer />
      <HeaderContainer />
      <div className="container">
        <div className="left">
          <EditorContainer />
          <SortedErrors />
        </div>
        <div className="right">
          <D3container />
          <InfoContainer />
        </div>
      </div>
    </div>
  );
};

export default EditorMode;
