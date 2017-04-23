import JSONSchema from "jsonschema";
import {getLineForPath} from "../../ast/ast";
import {pathToArray} from "../../helpers/path-to-array";
import schema from "./schema";

let schemaValidator = new JSONSchema.Validator()

export function validateSchema(jsonObj, yamlString) {

    function rewrite(instance, schema, options, ctx) {
        return {
            value: instance,
            base: ctx.base
        }
    }

    let options = {rewrite: rewrite}

    let validation = schemaValidator.validate(jsonObj, schema, options)

    return {
        docModel: validation.instance,
        errors: validation.errors.map(err => {
            const path = err.property.replace('instance.', '')
            return {
                line: getLineForPath(yamlString, pathToArray(path)),
                path: path,
                message: path + ' ' + err.message,
                scope: "schema"
            }
        })
    }

}
