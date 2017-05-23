import { connect } from "react-redux";

import { Editor } from "../components";

import { extractReferenceMap, setValue, validate } from "../actions";
import { setLineToGoTo } from "../actions";

const mapStateToProps = state => {
  return {
    yamlString: state.build.yamlString,
    errors: state.build.errors,
    lineToGoTo: state.navigation.line
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: () => dispatch(validate()),
    setValue: yamlString => dispatch(setValue(yamlString)),
    getMatrix: () => dispatch(extractReferenceMap()),
    onScroll: () => dispatch(setLineToGoTo(null))
  };
};

//prettier-ignore
const EditorContainer = connect(
    mapStateToProps,
    mapDispatchToProps)
(Editor);

export default EditorContainer;
