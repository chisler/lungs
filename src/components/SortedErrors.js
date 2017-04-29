import { connect } from 'react-redux';

import Errors from './Errors'


const sortedByLine = (errors) => {
    const comparator = (e1, e2) => {
        return e1.line > e2.line
    }

    let sortedErrors = Object.assign([], errors)

    sortedErrors.sort(comparator)
    return sortedErrors
}

const mapStateToProps = (state) => {
    return {
        errors: sortedByLine(state.build.errors),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (line) => dispatch({
            type: 'SET_LINE_TO_GO_TO',
            line
        })
    }
}

const SortedErrors = connect(
    mapStateToProps,
    mapDispatchToProps
)(Errors)

export default SortedErrors;

