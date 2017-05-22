import { combineReducers } from "redux";
import navigation from "./navigation";
import build from "./build";
import editor from "./editor";

const editorApp = combineReducers({
  build,
  navigation,
  editor
});

export default editorApp;
