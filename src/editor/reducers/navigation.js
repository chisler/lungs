const navigation = (state = {line: null}, action) => {
    switch (action.type) {
        case 'GO_TO_LINE':
            return {
                line: action.line
            }
        default:
            return state
    }
}

export default navigation