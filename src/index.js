import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import EditorContainer from "./containers/EditorContainer";
import SortedErrors from "./containers/SortedErrors";
import D3container from "./containers/D3container";
import VisibleInfo from "./containers/VisibleInfo";
import editorApp from "./reducers";
import { Provider } from "react-redux";

import "./index.css";

ReactDOM.render(
  <Provider store={createStore(editorApp)}>
    <div className="container">
      <div className="editor">
        <EditorContainer />
      </div>
      <div className="build">
        <SortedErrors />
        <D3container />
        <VisibleInfo />
      </div>
    </div>
  </Provider>,
  document.getElementById("root")
);
