import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import EditorContainer from "./containers/EditorContainer";
import SortedErrors from "./containers/SortedErrors";
import D3container from "./containers/D3container";
import InfoContainer from "./containers/InfoContainer";
import editorApp from "./reducers";
import { Provider } from "react-redux";

import "./index.css";

ReactDOM.render(
  <Provider store={createStore(editorApp)}>
    <div className="container">
      <div className="left">
        <EditorContainer />
        <SortedErrors />
      </div>
      <div className="build">
        <D3container />
        <InfoContainer />
      </div>
    </div>
  </Provider>,
  document.getElementById("root")
);
