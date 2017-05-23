import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import EditorContainer from "./containers/EditorContainer";
import SortedErrors from "./containers/SortedErrors";
import D3container from "./containers/D3container";
import InfoContainer from "./containers/InfoContainer";
import editorApp from "./reducers";

import { Header } from "./components/header/Header";
import { Provider } from "react-redux";

import "./index.css";
import { loadState, saveState } from "./reducers/local-storage";
import throttle from "lodash/throttle";

const persistedState = loadState();
const store = createStore(editorApp, persistedState);

store.subscribe(throttle(() => saveState(store.getState()), 500));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Header />
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
    </div>

  </Provider>,
  document.getElementById("root")
);
