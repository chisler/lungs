import { getAllLanguages, getAllReferences } from "../build/ast/doc-model";
import { validateReferences } from "../build/validators/semantic/references";
import { parseYAML } from "../build/parser/yaml";
import { validateSchema } from "../build/validators/structure/validator";

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
      //TODO: is it better to add this error to existing?
      errors: [parsedYaml.error]
    };
  }
  let jsonObj = parsedYaml.jsonObj;

  // Structural validation
  let validatedSchema = validateSchema(jsonObj, state.yamlString);
  let dM = validatedSchema.docModel;

  // Semantic validation
  const references = getAllReferences(dM);
  console.log(references);
  const v = validateReferences(dM, state.yamlString, references);

  return {
    ...state,
    errors: [...v.errors, ...validatedSchema.errors]
  };
};

const build = (state = null, action) => {
  //default case
  if (state === null) {
    //DEFAULT VALUE
    return validateState({ yamlString: mockYAML });
  }

  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        yamlString: action.yamlString
      };
    case "VALIDATE":
      return validateState(state);
    //TODO: refactor this
    case "EXTRACT_REFERENCE_MAP":
      if (state.errors.length) {
        //Do not update map if errors
        return state;
      }
      let parsedYaml = parseYAML(state.yamlString);
      const dM = validateSchema(parsedYaml.jsonObj, state.yamlString).docModel;
      const references = getAllReferences(dM);

      let languageMap = {};

      getAllLanguages(dM).forEach((language, index) => {
        const name = language.path;
        languageMap[name] = {
          name: name,
          id: index
        };
      });

      const numberOfLanguages = Object.keys(languageMap).length;

      function zeros(dimensions) {
        let array = [];
        for (let i = 0; i < dimensions[0]; ++i) {
          array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
        }
        return array;
      }

      let languageMatrix = zeros([numberOfLanguages, numberOfLanguages]);

      const cutByFirstDot = string => {
        if (!string.includes(".")) {
          return string;
        }
        return string.slice(0, string.indexOf("."));
      };

      //fill matrix
      references.forEach(reference => {
        const isInfluenced = cutByFirstDot(reference.path);
        const influencer = cutByFirstDot(reference.nodeValue);

        console.log(reference, isInfluenced, influencer);
        languageMatrix[languageMap[isInfluenced].id][
          languageMap[influencer].id
        ]++;
      });

      return {
        ...state,
        languageMatrix: languageMatrix,
        languageMap: languageMap
      };

    default:
      return state;
  }
};

export default build;
