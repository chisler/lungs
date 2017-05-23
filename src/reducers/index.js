import { combineReducers } from "redux";
import navigation from "./navigation";
import build from "./build";

const editorApp = combineReducers({
  build,
  navigation
});

export default editorApp;
