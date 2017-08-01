import { EDITOR_MODE } from "./constants";

const mode = (state = { mode: EDITOR_MODE }, action) => {
  switch (action.type) {
    case "SET_MODE":
      return {
        mode: action.mode
      };
    default:
      return state;
  }
};

export default mode;
