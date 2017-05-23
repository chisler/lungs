import { combineReducers } from "redux";
import navigation from "./navigation";
import build from "./build";
import popup from "./popup";

const editorApp = combineReducers({
  build,
  navigation,
  popup
});

export default editorApp;
