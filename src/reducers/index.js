import { combineReducers } from "redux";
import navigation from "./navigation";
import build from "./build";
import popup from "./popup";
import mode from "./mode";
import interaction from "./interaction";

const editorApp = combineReducers({
  build,
  navigation,
  interaction,
  mode,
  popup
});

export default editorApp;
