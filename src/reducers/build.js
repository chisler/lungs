import {
  getAllReferences,
  getInstanceMap,
  getReferencesFromNodes
} from "../build/ast/doc-model";
import { validateReferences } from "../build/validators/semantic/references";
import { parseYAML } from "../build/parser/yaml";
import { validateSchema } from "../build/validators/structure/validator";
import { getInstanceMatrix } from "./helpers";

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
      instanceMatrix: null,
      instanceMap: null,
      errors: null,
      areReferencesFixed: false
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
      //1 Input: linkedBase, linkBase, linkType
      //2. linkedInstances = getAllByBase(linkedBase)
      //3. linkedMap = getMap(linkedInstances)
      //4. links = getAllByBase(linkBase)
      //5. each(links, link => {return ...{referral: instance.name, referenced: instance.name} })
      //6. links => Fill linkedMatrix
      const linkedBase = "/#/definitions/feature";
      const linkBase = "/#/definitions/feature";
      const linkType = "inspired_by";

      if (state.errors.length) {
        //Do not update map if errors
        return state;
      }

      let parsedYaml = parseYAML(state.yamlString);
      const dM = validateSchema(parsedYaml.jsonObj, state.yamlString).docModel;
      const referenceNodes = getAllReferences(dM);

      console.log(referenceNodes);

      const instanceMap = getInstanceMap(dM, linkedBase);
      const references = getReferencesFromNodes(
        dM,
        state.yamlString,
        referenceNodes,
        linkedBase
      );

      if (!references.length > 0) {
        return state;
      }

      const instanceMatrix = getInstanceMatrix(instanceMap, references);

      return {
        ...state,
        references: references,
        instanceMatrix: instanceMatrix,
        instanceMap: instanceMap
      };
    case "CHOOSE_LANGUAGES":
      if (!state.references) {
        return state;
      }
      const chosenLanguages = action.chosenLanguages.filter(
        item => item !== null && item !== undefined
      );

      const isReferralOrReferenced = (chosenLanguages, reference) => {
        switch (chosenLanguages.length) {
          case 1:
            return (
              chosenLanguages[0] === reference.referral[0] ||
              chosenLanguages[0] === reference.value[0]
            );
          case 2:
            return (
              (chosenLanguages[0] === reference.referral[0] &&
                chosenLanguages[1] === reference.value[0]) ||
              (chosenLanguages[1] === reference.referral[0] &&
                chosenLanguages[0] === reference.value[0])
            );
        }
      };

      let chosenReferences = state.references.map(reference => {
        const isVisible = isReferralOrReferenced(chosenLanguages, reference);
        return {
          ...reference,
          isVisible
        };
      });

      return {
        ...state,
        references: chosenReferences
      };
    case "FIX_REFERENCES":
      return {
        ...state,
        areReferencesFixed: true
      };
    case "UNFIX_REFERENCES":
      return {
        ...state,
        areReferencesFixed: false
      };
    default:
      return state;
  }
};

export default build;
