import {isBaseReference, isPathValid} from "../../ast/doc-model";
import {pathToArray} from "../../helpers/path-to-array";
import {getLineForPath} from "../../ast/ast";;


export function getAllReferences(docModel) {
    var references = []

    find(docModel, '')

    return references

    function find(docModel, pathString) {
        if (!docModel) {
            return
        }

        if (isBaseReference(docModel.base)) {
            references.push({
                //trim first dot from path
                path: pathString.slice(1),
                referenceString: docModel.value
            })
        }

        if (docModel && docModel.value && typeof docModel.value !== "string") {
            Object.keys(docModel.value).forEach(key => {
                    //keys of array are indices
                    find(docModel.value[key], pathString + '.' + key.toString())
                }
            )
        }
    }

}

export function validateReferences(docModel, editorValue, references) {
    let errors = []
    let error

    references.forEach(reference => {
        error = validateReference(docModel, editorValue, reference)
        if (error) {
            errors.push(error)
        }
    })

    return {
        references: references,
        errors: errors
    }

}

//Returns only errors
function validateReference(docModel, editorValue, reference) {
    let referenceArray = pathToArray(reference.referenceString)

    if (!isPathValid(docModel, referenceArray)) {
        return {
            message: "Invalid reference " + reference.referenceString,
            line: getLineForPath(editorValue, pathToArray(reference.path)),
            scope: "reference"
        }
    }
}
