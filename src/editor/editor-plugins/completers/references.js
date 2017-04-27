import {validateSchema} from "../../../validators/structure/validator";
import {pathToArray} from "../../../helpers/path-to-array";
import {getDmNodeByPath, isBaseReference} from "../../../ast/doc-model";
import {parseYAML} from "../../../parser/yaml";
import {getAstNodeForPath, getPathForPosition} from "../../../ast/ast";

export function getReferenceCompletions(docModel, referenceString) {
    let referenceArray = pathToArray(referenceString)

    //check if the word is complete: kotlin.features_
    if (referenceString[-1] !== ".") {
        referenceArray = referenceArray.slice(0, -1)
    }
    let node = getDmNodeByPath(docModel, referenceArray)
    console.log("referenceArray", referenceArray, "node", node)

    if (!node || !node.value || typeof node.value === "string") {
        return []
    }

    let completions = Object.keys(node.value)

    completions = completions.filter(function(competion){
        return node.value[competion].value != undefined;
    })

    console.log(completions)
    return completions
}


export function getReferenceCompletionsForPosition(originalPos, prefix, editorValue) {
    console.log(prefix)
    let parsedYaml = parseYAML(editorValue)

    if (parsedYaml.error) {
        return []
    }

    let jsonObj = parsedYaml.jsonObj

    //TODO: Do we need it here?
    let pathArray = getPathForPosition(originalPos, editorValue)
    let validated = validateSchema(jsonObj, editorValue)

    let node = getDmNodeByPath(validated.docModel, pathArray)

    if (!isBaseReference(node.base)) {
        return []
    }

    let referenceString = node.value
    let astNode = getAstNodeForPath(editorValue, pathArray)
    let prefixLength = astNode.end_mark.column - originalPos.column

    if (prefixLength >= 0) {
        referenceString = referenceString.slice(0, referenceString.length - prefixLength)
    } else
        referenceString = ""
    return getReferenceCompletions(validated.docModel, referenceString)
}
