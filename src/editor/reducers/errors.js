let errorNumber = 0

const errors = (state = ['error'], action) => {
    switch (action.type) {
        case 'VALIDATE':
            errorNumber++;
           return [...state, ('error ' + errorNumber.toString())]
        default:
            return state
    }
}

export default errors