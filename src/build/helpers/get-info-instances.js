import { getDmNodeByPath } from "../ast/doc-model";
import parseYAML from "../parser/yaml";
import validateSchema from "../validators/structure/validator";
import { pathToArray } from "../helpers/path-to-array";

export const getInfoInstances = (yamlString, paths) => {
  if (!paths) {
    return [];
  }

  let parsedYaml = parseYAML(yamlString);

  if (parsedYaml.error) {
    return [];
  }

  const v = validateSchema(parsedYaml.jsonObj, yamlString);

  if (v.errors.length) {
    return [];
  }

  return paths.filter(Boolean).map(pathString => {
    return {
      ...getDmNodeByPath(v.docModel, pathToArray(pathString)),
      pathString
    };
  });
};
