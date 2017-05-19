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

export const extractReferenceMap = () => {
  return {
    type: "EXTRACT_REFERENCE_MAP"
  };
};

export const chooseInstances = chosenInstances => {
  return {
    type: "CHOOSE_INSTANCES",
    chosenInstances
  };
};