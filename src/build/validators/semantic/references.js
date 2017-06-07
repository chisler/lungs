import { isPathValid, getBaseForPath } from "../../ast/doc-model";
import { pathToArray } from "../../helpers/path-to-array";
import { getLineForPath } from "../../ast/ast";
import schema from "../structure/schema";

export function validateReferences(docModel, yamlString, references) {
  return {
    errors: references
      .map(reference => {
        return validateReference(docModel, yamlString, reference);
      })
      .filter(Boolean)
  };
}

//Returns only errors
function validateReference(docModel, yamlString, reference) {
  const referenceArray = pathToArray(reference.nodeValue);

  //validate presence
  if (!isPathValid(docModel, referenceArray)) {
    return {
      message: `Invalid reference ${reference.nodeValue}`,
      line: getLineForPath(yamlString, pathToArray(reference.path)),
      scope: "reference"
    };
  }

  const destinationBase = getBaseForPath(docModel, referenceArray);
  if (!isDestinationValid(destinationBase, reference.base, schema)) {
    return {
      message: `Invalid destination ${destinationBase}. Valid destinations: ${getValidDestinations(reference.base, schema)}`,
      line: getLineForPath(yamlString, pathToArray(reference.path)),
      scope: "reference"
    };
  }
}

function isDestinationValid(destinationBase, referenceBase, schema) {
  const validDestinations = getValidDestinations(referenceBase, schema);

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
