const interaction = (
  state = {
    chosenInstances: [],
    hoveredInstances: []
  },
  action
) => {
  switch (action.type) {
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

export default interaction;