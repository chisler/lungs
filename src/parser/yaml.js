import YAML from "yaml-js";

//TODO: If errors use last successful build
//TODO: tolerating errors

//Returns jsonObj and errors
export function parseYAML(yamlString) {

    let res = {
        jsonObj: null,
        error: null,
        line: null
    }

    try {
        res.jsonObj = YAML.load(yamlString)

    } catch (error) {
        console.warn(error.stack)

        res.error = error.stack
        res.line = error.problem_mark.line
    }

    return res
}