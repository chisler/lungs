import { validateYamlString } from "../build/helpers/validate-yaml-string";
import {extractInstanceMap} from "../build/helpers/extract-instance-map";

const getDefaultState = () => {
  return {
    yamlString: "",
    instanceMatrix: null,
    instanceMap: null,
    chosenInstances: [],
    hoveredInstances: [],
    errors: []
  };
};

const build = (state = null, action) => {
  if (state === null) {
    return getDefaultState();
  }

  switch (action.type) {
    case "RESET_TO_DEFAULT":
      return getDefaultState();
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

    case "CHOOSE_INSTANCES":
      const chosenInstances = action.chosenInstances.filter(Boolean);

      return {
        ...state,
        chosenInstances
      };
    case "HOVER_INSTANCES":
      const hoveredInstances = action.hoveredInstances.filter(Boolean);

      return {
        ...state,
        hoveredInstances
      };
    default:
      return state;
  }
};

export default build;
