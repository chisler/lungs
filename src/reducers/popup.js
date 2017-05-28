const popup = (state = { isShown: false }, action) => {;
  switch (action.type) {
    case "SET_POPUP_IS_SHOWN":
      return {
        isShown: action.isShown
      };
    default:
      return state;
  }
};

export default popup;
