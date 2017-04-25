const mockYAML = `kotlin:
  name: Kotlin
  description: This is a great thing!
  creator: 12
  people:
    - Andrey Breslav
    - 1
    - Roman Elizarov
  features:
    val_var:
        inspired_by: kotlin.features.
        description: Some features have their own description or rationale.
    types_on_the_right: 
        inspired_by: kotlin.features.f
        description: Some features have their own description or rationale.
`;


const yamlString = (state = mockYAML, action) => {
    switch (action.type) {
        case 'SET_VALUE':
            console.log('new state = ', action.yamlString)
            return action.yamlString
        default:
            return state
    }
}

export default yamlString