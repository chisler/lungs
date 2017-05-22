const editor = (state = { editor: null }, action) => {
  switch (action.type) {
    case "SET_EDITOR":
      return {
        editor: action.editor
      };
    //  FIXME: does not mutate the state, but resizes ace. HACK HERE
    case "RESIZE_EDITOR":
      state.editor.resize();
      return state;
    default:
      return state;
  }
};

export default editor;
