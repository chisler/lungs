import {
  getAllReferences,
  getLanguageMap,
  getReferencesFromNodes
} from "../build/ast/doc-model";
import { validateReferences } from "../build/validators/semantic/references";
import { parseYAML } from "../build/parser/yaml";
import { validateSchema } from "../build/validators/structure/validator";
import { getLanguageMatrix } from "./helpers";

const mockYAML = `kotlin:
  name: Kotlin
  features:
    f1:
        inspired_by: scala
    f2:
        inspired_by: scala
scala:
  name: Scala
  features: 
    f1:
      inspired_by: js
    f2:
      inspired_by: kotlin
js:
  name: Javascript
  features: 
    f1:
      inspired_by: pascal
    f2:
      inspired_by: scala
pascal:
  name: Pascal
  features: 
    f1:
      inspired_by: scala
    f2:
      inspired_by: scala

`;

//Gets the editor value => returns new state
const validateState = state => {
  let parsedYaml = parseYAML(state.yamlString);
  if (parsedYaml.error) {
    return {
      ...state,
      errors: [parsedYaml.error]
    };
  }
  let jsonObj = parsedYaml.jsonObj;

  // Structural validation
  let validatedSchema = validateSchema(jsonObj, state.yamlString);
  let dM = validatedSchema.docModel;

  // Semantic validation
  const referenceNodes = getAllReferences(dM);

  const v = validateReferences(dM, state.yamlString, referenceNodes);

  return {
    ...state,
    errors: [...v.errors, ...validatedSchema.errors]
  };
};

const build = (state = null, action) => {
  //default case
  if (state === null) {
    //DEFAULT VALUE
    return validateState({
      yamlString: mockYAML,
      references: [],
      languageMatrix: null,
      languageMap: null,
      errors: null
    });
  }
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        yamlString: action.yamlString
      };
    case "VALIDATE":
      return validateState(state);
    case "EXTRACT_REFERENCE_MAP":
      if (state.errors.length) {
        //Do not update map if errors
        return state;
      }

      let parsedYaml = parseYAML(state.yamlString);
      const dM = validateSchema(parsedYaml.jsonObj, state.yamlString).docModel;
      const referenceNodes = getAllReferences(dM);

      const languageMap = getLanguageMap(dM);
      const references = getReferencesFromNodes(referenceNodes);
      const languageMatrix = getLanguageMatrix(languageMap, references);

      return {
        ...state,
        references: references,
        languageMatrix: languageMatrix,
        languageMap: languageMap
      };
    case "CHOOSE_ONE_LANGUAGE":
      const oldReferences = state.references;
      if (!oldReferences) {
        return state;
      }
      const chosenLanguage = action.chosenLanguage;
      console.log(chosenLanguage)

      let newReferences = oldReferences.map(reference => {
        const isReferralOrReferenced =
          chosenLanguage === reference.referral[0] ||
          chosenLanguage === reference.value[0];
        console.log(reference.referral[0], reference.value[0], isReferralOrReferenced)

        return {
          ...reference,
          isVisible: isReferralOrReferenced
        };
      });

      return {
        ...state,
        references: newReferences
      };

    default:
      return state;
  }
};

export default build;
