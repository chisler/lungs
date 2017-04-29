import {getAllLanguages, getAllReferences} from "../build/ast/doc-model"
import {validateReferences} from "../build/validators/semantic/references";
import {parseYAML} from "../build/parser/yaml";
import {validateSchema} from "../build/validators/structure/validator";

const mockYAML = `kotlin:
  name: Kotlin
  description: This is a great thing!
  creator: You
  ancestor: kotlin
  people:
    - Andrey Breslav
    - Other gut
    - Roman Elizarov
  features:
    val_var:
        inspired_by: kotlin.features.
        description: Some features have their own description or rationale.
    types_on_the_right:
        inspired_by: kotlin.features.f
        description: Some features have their own description or rationale.
`;


//Gets the editor value => returns new state
const validateState = (state) => {
    let parsedYaml = parseYAML(state.yamlString)
    if (parsedYaml.error) {
        return {
            ...state,
            //TODO: is it better to add this error to existing?
            errors: [parsedYaml.error],
        }
    }
    let jsonObj = parsedYaml.jsonObj

    // Structural validation
    let validatedSchema = validateSchema(jsonObj, state.yamlString)
    let dM = validatedSchema.docModel

    // Semantic validation
    const references = getAllReferences(dM)
    const v = validateReferences(dM, state.yamlString, references)

    return {
        ...state,
        errors: [
            ...v.errors,
            ...validatedSchema.errors
        ]
    }
}


const build = (state = null, action) => {
    //default case
    if (state === null) {
        //DEFAULT VALUE
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

        case 'EXTRACT_REFERENCE_MAP':
            if (state.errors.length) {
                //Do not update map if errors
                return state
            }
            let parsedYaml = parseYAML(state.yamlString)
            const dM = validateSchema(parsedYaml.jsonObj, state.yamlString).docModel
            const references = getAllReferences(dM)

            let languageMap = {}

            getAllLanguages(dM).forEach((language, index) => {
                const name = language.path
                languageMap[name] = {
                    name: name,
                    id: index
                }
            })

            const numberOfLanguages = Object.keys(languageMap).length

            function zeros(dimensions) {
                let array = [];
                for (let i = 0; i < dimensions[0]; ++i) {
                    array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
                }
                return array;
            }

            let languageMatrix = zeros([numberOfLanguages, numberOfLanguages])

            const cutByFirstDot = (string) => {
                if (!string.includes('.')) {
                    return string
                }
                return string.slice(0, string.indexOf('.'))
            }

            //fill matrix
            references.forEach(reference => {
                const isInfluenced = cutByFirstDot(reference.path)
                const influencer = cutByFirstDot(reference.nodeValue)

                console.log(reference, isInfluenced, influencer)
                languageMatrix[
                    languageMap[isInfluenced].id
                    ]
                    [
                    languageMap[influencer].id
                    ]++
            })

            console.log(languageMatrix);

            return {
                ...state,
                languageMap: languageMap
            }

        default:
            return state
    }
}


export default build