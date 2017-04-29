import { connect } from 'react-redux';

import Editor from './Editor'

const mapStateToProps = (state) => {
    return {
        yamlString: state.build.yamlString,
        errors: state.build.errors,
        lineToGoTo: state.navigation.line
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: () => dispatch({
            type: 'VALIDATE'
        }),
        setValue: (yamlString) => dispatch({
            type: 'SET_VALUE',
            yamlString
        })
    }
}

const EditorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor)

export default EditorContainer;

