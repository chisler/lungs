import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";

import {
  EditorContainer,
  SortedErrors,
  D3container,
  HeaderContainer,
  InfoContainer,
  GitHubContainer
} from "../containers";
import editorApp from "../reducers";

import { loadState, saveState } from "../reducers/helpers";
import throttle from "lodash/throttle";

import "./App.css";

const persistedState = loadState();
const store = createStore(editorApp, persistedState);
store.subscribe(throttle(() => saveState(store.getState()), 500));

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
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
      </Provider>
    );
  }
}

export default App;
