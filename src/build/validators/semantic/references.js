import { isPathValid } from "../../ast/doc-model";
import { pathToArray } from "../../helpers/path-to-array";
import { getLineForPath } from "../../ast/ast";

export function validateReferences(docModel, editorValue, references) {
  let errors = [];
  let error;

  references.forEach(reference => {
    error = validateReference(docModel, editorValue, reference);
    if (error) {
      errors.push(error);
    }
  });

  return {
    references: references,
    errors: errors
  };
}

//Returns only errors
function validateReference(docModel, editorValue, reference) {
  const referenceArray = pathToArray(reference.nodeValue);

  //validate presence
  if (!isPathValid(docModel, referenceArray)) {
    return {
      message: "Invalid reference " + reference.nodeValue,
      line: getLineForPath(editorValue, pathToArray(reference.path)),
      scope: "reference"
    };
  }
}
