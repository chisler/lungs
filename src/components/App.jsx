import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";

import EditorContainer from "../containers/EditorContainer";
import SortedErrors from "../containers/SortedErrors";
import D3container from "../containers/D3container";
import InfoContainer from "../containers/InfoContainer";
import editorApp from "../reducers";

import HeaderContainer from "../containers/HeaderContainer";

import { loadState, saveState } from "../reducers/local-storage";
import throttle from "lodash/throttle";

import "./App.css";

const persistedState = loadState();
const store = createStore(editorApp, persistedState);
store.subscribe(throttle(() => saveState(store.getState()), 500));

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <HeaderContainer />
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
    </Provider>
  );
};

export default App;
