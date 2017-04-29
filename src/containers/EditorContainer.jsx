import {connect} from "react-redux";

import Editor from "../components/Editor";

import {extractReferenceMap, setValue, validate} from "../actions";

const mapStateToProps = (state) => {
    console.log(state)

    return {
        yamlString: state.build.yamlString,
        errors: state.build.errors,
        lineToGoTo: state.navigation.line
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: () => dispatch(validate()),
        setValue: (yamlString) => dispatch(setValue(yamlString)),
        getMatrix: () => dispatch(extractReferenceMap())
    }
}

const EditorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor)

export default EditorContainer;

