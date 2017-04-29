import {connect} from "react-redux";

import Editor from "../components/Editor";

import {setValue, validate} from "../actions";

const mapStateToProps = (state) => {
    return {
        yamlString: state.build.yamlString,
        errors: state.build.errors,
        lineToGoTo: state.navigation.line
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: () => dispatch(validate()),
        setValue: (yamlString) => dispatch(setValue(yamlString))
    }
}

const EditorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor)

export default EditorContainer;

