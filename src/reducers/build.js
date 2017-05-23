import {
  getAllReferences,
  getDmNodeByPath,
  getInstanceMap,
  getReferencesFromNodes
} from "../build/ast/doc-model";
import { validateReferences } from "../build/validators/semantic/references";
import { parseYAML } from "../build/parser/yaml";
import { validateSchema } from "../build/validators/structure/validator";
import { getInstanceMatrix } from "./helpers";
import { pathToArray } from "../build/helpers/path-to-array";

const mockYAML = `kotlin:
  name: Kotlin
  features:
    val_var:
        inspired_by: scala
    lambda:
        inspired_by: scala
scala:
  name: Scala
  features: 
    implicits:
      inspired_by: js
    akka:
      inspired_by: kotlin
js:
  name: Javascript
  features: 
    arrow_functions:
      inspired_by: pascal
    super:
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

const getInfoInstances = (state, paths) => {
  if (state.errors.length || !paths) {
    return [];
  }

  let infoInstances = [];
  let parsedYaml = parseYAML(state.yamlString);
  const dM = validateSchema(parsedYaml.jsonObj, state.yamlString).docModel;

  paths.filter(Boolean).forEach(pathString => {
    infoInstances.push({
      ...getDmNodeByPath(dM, pathToArray(pathString)),
      pathString
    });
  });
  return infoInstances;
};

const getDefaultState = () => {
  let yamlString = mockYAML;
  //TODO: make async
  //FIXME: state is initialized 3 times
  // const link =
  //   "https://api.github.com/repos/languagesWiki/languageWiki/contents/languages.yml";
  // let request = new XMLHttpRequest();
  // request.open("GET", link, false); // `false` makes the request synchronous
  // request.setRequestHeader("accept", "application/vnd.github.VERSION.raw");
  // request.send(null);
  //
  // //DEFAULT VALUE
  // if (request.status == 200) {
  //   yamlString = request.responseText;
  // }

  return validateState({
    yamlString: yamlString,
    instanceMatrix: null,
    instanceMap: null,
    chosenInstances: [],
    hoveredInstances: [],
    infoInstances: [],
    errors: null
  });
};

const build = (state = null, action) => {
  //default case
  if (state === null) {
    return getDefaultState();
  }

  switch (action.type) {
    case "RESET_TO_DEFAULT":
      return getDefaultState();
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
      const linkedBase = "/#/definitions/language";
      // const linkBase = "/#/definitions/feature";
      // const linkType = "inspired_by";

      if (state.errors.length) {
        //Do not update map if errors
        return state;
      }

      let parsedYaml = parseYAML(state.yamlString);

      if (parsedYaml.error) {
        return state;
      }

      const dM = validateSchema(parsedYaml.jsonObj, state.yamlString).docModel;
      const referenceNodes = getAllReferences(dM);
      const references = getReferencesFromNodes(
        dM,
        state.yamlString,
        referenceNodes,
        linkedBase
      );

      if (!references.length > 0) {
        return state;
      }

      const instanceMap = getInstanceMap(dM, linkedBase);
      const instanceMatrix = getInstanceMatrix(instanceMap, references);

      return {
        ...state,
        instanceMatrix,
        instanceMap
      };
    case "CHOOSE_INSTANCES":
      const chosenInstances = action.chosenInstances.filter(Boolean);

      return {
        ...state,
        chosenInstances,
        infoInstances: getInfoInstances(state, chosenInstances) ||
          state.infoInstances
      };
    case "HOVER_INSTANCES":
      const hoveredInstances = action.hoveredInstances.filter(Boolean);

      return {
        ...state,
        hoveredInstances,
        infoInstances: getInfoInstances(
          state,
          state.chosenInstances.length
            ? state.chosenInstances
            : hoveredInstances
        ) || state.infoInstances
      };
    default:
      return state;
  }
};

export default build;
