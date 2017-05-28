import { combineReducers } from "redux";
import navigation from "./navigation";
import build from "./build";
import popup from "./popup";
import mode from "./mode";

const editorApp = combineReducers({
  build,
  navigation,
  mode,
  popup
});

export default editorApp;
