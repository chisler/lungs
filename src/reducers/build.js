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
  creator: JetBrains
  people: 
    - Me
    - You
    - I
  description: Best for building Android apps.
  features:
    val_var:
        description: Val_var description.
    lambda:
        description: Even before Java 8.
        inspired_by: pascal
scala:
  name: Scala
  creator: JetBrains
  people: 
    - Me
    - You
    - I
  description: Best for building Android apps.
  features: 
    implicits:
      description: No idea.
      inspired_by: C
    akka:
      description: Name is kinda cool.
      inspired_by: js
js:
  name: Javascript
  features: 
    arrow_functions:
      description: Syntax sugar for functions.
      inspired_by: pascal
    super:
      description: Call super() method in constuctor.
      inspired_by: scala
pascal:
  name: Pascal
  features: 
    begin_end:
      description: The keyword begin is used to indicate the start of the executable section of a function, method of an object, procedure, program, property of an object, or is used to delineate the start of a block statement.
      inspired_by: scala
    procedures:
      description: A procedure is a subprogram. Subprograms help reduce the amount of redundancy in a program. Statements that are executed over and over again but not contained in a loop are often put into subprograms.
      inspired_by: scala
C:
  name: C
  creator: Dennis Ritchie
  description: C is a general-purpose, imperative computer programming language, supporting structured programming, lexical variable scope and recursion, while a static type system prevents many unintended operations. 
  features: 
    pointers:
      description: C supports the use of pointers, a type of reference that records the address or location of an object or function in memory.
      inspired_by: scala
    arrays:
      description: Array types in C are traditionally of a fixed, static size specified at compile time. (The more recent C99 standard also allows a form of variable-length arrays.) However, it is also possible to allocate a block of memory (of arbitrary size) at run-time, using the standard library's malloc function, and treat it as an array. C's unification of arrays and pointers means that declared arrays and these dynamically allocated simulated arrays are virtually interchangeable.
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

  // //DEFAULT VALUE
  // if (request.status === 200) {
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
