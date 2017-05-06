import { isPathValid, getBaseForPath } from "../../ast/doc-model";
import { pathToArray } from "../../helpers/path-to-array";
import { getLineForPath } from "../../ast/ast";
import schema from "../structure/schema";

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
      message: `Invalid reference ${reference.nodeValue}`,
      line: getLineForPath(editorValue, pathToArray(reference.path)),
      scope: "reference"
    };
  }

  const destinationBase = getBaseForPath(docModel, referenceArray);
  if (!isDestinationValid(destinationBase, reference.base, schema)) {
    return {
      message: `Invalid destination ${destinationBase}. Valid destinations: ${getValidDestinations(reference.base, schema)}`,
      line: getLineForPath(editorValue, pathToArray(reference.path)),
      scope: "reference"
    };
  }
}

function isDestinationValid(destinationBase, referenceType, schema) {
  const validDestinations = getValidDestinations(referenceType, schema);

  return validDestinations && validDestinations.includes(destinationBase);
}

function getValidDestinations(referenceType, schema) {
  const definitionArray = referenceType.split("/").slice(2);
  let pointer = schema;

  definitionArray.forEach(key => {
    pointer = pointer[key];
  });

  return pointer.validDestinations;
}
