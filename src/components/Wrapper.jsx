import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";

import AppContainer from '../containers/AppContainer'

import editorApp from "../reducers";
import { loadState, saveState } from "../reducers/helpers";
import throttle from "lodash/throttle";

const persistedState = loadState();
const store = createStore(editorApp, persistedState);
store.subscribe(throttle(() => saveState(store.getState()), 500));

class Wrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

export default Wrapper;
