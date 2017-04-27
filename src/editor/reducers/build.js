import { getDocModel } from "../../ast/doc-model";
import { getAllReferences, validateReferences } from "../../validators/semantic/references";
import {parseYAML} from "../../parser/yaml";
import {validateSchema} from "../../validators/structure/validator";
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

const build = (state = null, action) => {
    //default case
    if (state === null) {
        console.warn('DEFAULT')
        return validateState({yamlString: mockYAML})
    }

    switch (action.type) {
        case 'SET_VALUE':
            return {
                ...state,
                yamlString: action.yamlString
            }
        case 'VALIDATE':
            return validateState(state)
        default:
            return state
    }
}


//Gets the editor value => returns new state
const validateState = (state) => {
    let parsedYaml = parseYAML(state.yamlString)
    if (parsedYaml.error) {
        return {
            ...state,
            //TODO: is it better to add this error to existing?
            errors: [parsedYaml.error]
        }
    }

    let jsonObj = parsedYaml.jsonObj
    let validatedSchema = validateSchema(jsonObj, state.yamlString)

    let dM = validatedSchema.docModel
    let r = getAllReferences(dM)
    let v = validateReferences(dM, state.yamlString, r)
    return {
        ...state,
        errors: [
            ...v.errors,
            ...validatedSchema.errors
        ]
    }
}


export default build