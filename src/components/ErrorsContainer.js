import { connect } from 'react-redux';

import Errors from './Errors'

const mapStateToProps = (state) => {
    return {
        errors: state.build.errors,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (line) => dispatch({
            type: 'GO_TO_LINE',
            line
        })
    }
}

const ErrorsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Errors)

export default ErrorsContainer;

