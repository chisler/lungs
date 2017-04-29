import {recoverEditorValue} from "../../helpers/recover-editor-value";
import {parseYAML} from "../../parser/yaml";
import {getPathForPosition} from "../../ast/ast";
import {validateSchema} from "../../validators/structure/validator";
import {getBaseForPath} from "../../ast/doc-model";
import schema from "../../validators/structure/schema";

export function getKeywordsForPosition(originalPos, prefix, editorValue) {
    editorValue = recoverEditorValue(originalPos, prefix, editorValue)
    let parsedYaml = parseYAML(editorValue)

    if (parsedYaml.error) {
        return []
    }

    let jsonObj = parsedYaml.jsonObj

    let path = getPathForPosition(originalPos, editorValue)
    let validated = validateSchema(jsonObj, editorValue)
    return getKeywordsForPath(validated.docModel, path)

}

function getKeywordsForPath(docModel, pathArray) {

    let base = getBaseForPath(docModel, pathArray)

    return getKeywordsForBase(base)
}


function getKeywordsForBase(base) {

    //substr 1 for deleting '#' or lonely '/'
    let index = base.indexOf('definitions')

    if (index < 0) {
        return []
    }

    let baseArray = base.substr(index).split('/')
    let scope = schema;

    for (let i = 0; i < baseArray.length; i++) {
        scope = scope[baseArray[i]]
    }
    return Object.keys(scope.properties || {})
}
