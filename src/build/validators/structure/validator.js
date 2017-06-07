import { Validator } from "jsonschema";
import { getLineForPath } from "../../ast/ast";
import { pathToArray } from "../../helpers/path-to-array";
import projectSchema from "./schema";

let schemaValidator = new Validator();

export function validateCustomSchema (jsonObj, yamlString, schema) {
  const rewrite = (instance, schema, options, ctx) => {
    if (!instance) {
      return instance;
    }
    return {
      value: instance,
      base: ctx.base
    };
  };

  let options = { rewrite: rewrite };

  let validation = schemaValidator.validate(jsonObj, schema, options);
  return {
    docModel: validation.instance,
    errors: validation.errors.map(err => {
      const path = err.property.replace("instance.", "");
      return {
        line: getLineForPath(yamlString, pathToArray(path)),
        message: path + " " + err.message,
        scope: "schema"
      };
    })
  };
};

const validateClosure = schema => (jsonObj, yamlString) =>
  validateCustomSchema(jsonObj, yamlString, schema);

const validateProjectSchema = validateClosure(projectSchema);

export default validateProjectSchema;
