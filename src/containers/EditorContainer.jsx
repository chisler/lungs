import { connect } from "react-redux";

import Editor from "../components/editor/Editor";

import { extractReferenceMap, setValue, validate } from "../actions";
import {setEditor} from "../actions/index";

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
    setEditor: (editor) => dispatch(setEditor(editor))
  };
};

//prettier-ignore
const EditorContainer = connect(
    mapStateToProps,
    mapDispatchToProps)
(Editor);

export default EditorContainer;
