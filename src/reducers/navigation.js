const navigation = (state = {line: null}, action) => {
    switch (action.type) {
        case 'SET_LINE_TO_GO_TO':
            return {
                line: action.line
            }
        default:
            return state
    }
}

export default navigation