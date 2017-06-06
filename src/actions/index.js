import fetch from "isomorphic-fetch";

import { EDITOR_MODE, DISPLAY_MODE } from "../reducers/constants";
import { fetchYaml } from "../build/helpers/fetch-yaml-sync";

export const validate = () => {
  return {
    type: "VALIDATE"
  };
};

export const setValue = yamlString => {
  return {
    type: "SET_VALUE",
    yamlString
  };
};

export const setLineToGoTo = line => {
  return {
    type: "SET_LINE_TO_GO_TO",
    line
  };
};

export const extractInstanceMap = () => {
  return {
    type: "EXTRACT_INSTANCE_MAP"
  };
};

export const chooseInstances = chosenInstances => {
  return {
    type: "CHOOSE_INSTANCES",
    chosenInstances
  };
};

export const hoverInstances = hoveredInstances => {
  return {
    type: "HOVER_INSTANCES",
    hoveredInstances
  };
};

export const resetToDefault = () => {
  return {
    type: "RESET_TO_DEFAULT"
  };
};

export const setPopupIsShown = isShown => {
  return {
    type: "SET_POPUP_IS_SHOWN",
    isShown
  };
};

export const setDisplayMode = () => {
  return {
    type: "SET_MODE",
    mode: DISPLAY_MODE
  };
};

export const setEditorMode = () => {
  return {
    type: "SET_MODE",
    mode: EDITOR_MODE
  };
};

export const fetchYamlSync = () => {
  return {
    type: "SET_VALUE",
    yamlString: fetchYaml()
  };
};
