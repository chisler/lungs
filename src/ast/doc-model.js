import {parseYAML} from "../parser/yaml";
import {validateSchema} from "../validators/structure/validator";

export function getDocModel(editorValue) {
    let parsedYaml = parseYAML(editorValue)
    if (parsedYaml.error) {
        return {}
    }
    let jsonObj = parsedYaml.jsonObj
    let docModel = validateSchema(jsonObj, editorValue).docModel

    return docModel
}

export function getBaseForPath(docModel, pathArray) {
    let node = docModel

    for (let i = 0; i < pathArray.length; i++) {
        node = node.value[pathArray[i]];
    }

    //default case for not scheme-valid nodes
    return node.base || '/'
}


export function isPathValid(docModel, pathArray) {
    let node = docModel
    let key;

    for (let i = 0; i < pathArray.length; i++) {
        key = pathArray[i]
        if (!node.value || !key) {
            return false
        }

        node = node.value[key]
        if (!node || !node.value) {
            return false
        }
    }

    return true
}


//if path is incorrect, returns null
export function getDmNodeByPath(docModel, pathArray) {
    let node = docModel
    let key;

    for (let i = 0; i < pathArray.length; i++) {
        key = pathArray[i]
        if (!node.value[key] || !key) {
            return null
        }
        node = node.value[key]
    }

    return node
}

export function isBaseReference(base) {
    return base === "/#/definitions/reference"
}
