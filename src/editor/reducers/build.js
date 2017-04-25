import {getDocModel} from "../../ast/doc-model";
import {getAllReferences, validateReferences} from "../../validators/semantic/references";
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

//TODO: remove defalts from reducer

const build = (state = null , action) => {
    //default case
    if (state === null) {
        let yamlString = mockYAML
        let dM = getDocModel(yamlString)
        let r = getAllReferences(dM)
        let v = validateReferences(dM, mockYAML, r)
        return {
            yamlString: yamlString,
            errors: v.errors
        }
    }

    switch (action.type) {
        case 'SET_VALUE':
            return {
                ...state,
                yamlString: action.yamlString
            }
        case 'VALIDATE':
            let dM = getDocModel(state.yamlString)
            let r = getAllReferences(dM)
            let v = validateReferences(dM, mockYAML, r)
            return {
                ...state,
                errors: v.errors
            }
        default:
            return state
    }
}

export default build