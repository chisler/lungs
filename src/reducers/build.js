import validateYamlString from "../build/helpers/validate-yaml-string";
import extractInstanceMap from "../build/helpers/extract-instance-map";

const defaultState = {
  yamlString: "",
  instanceMatrix: null,
  instanceMap: null,
  errors: []
};

const build = (state = defaultState, action) => {
  switch (action.type) {
    case "RESET_TO_DEFAULT":
      return defaultState;
    case "SET_VALUE":
      return {
        ...state,
        yamlString: action.yamlString
      };
    case "VALIDATE":
      return {
        ...state,
        errors: validateYamlString(state.yamlString).errors
      };
    case "EXTRACT_INSTANCE_MAP":
      const linkedBase = "/#/definitions/language";

      return {
        ...state,
        ...extractInstanceMap(state.yamlString, linkedBase, state.errors)
      };
    default:
      return state;
  }
};

export default build;
