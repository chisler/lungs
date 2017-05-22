import { pathToArray } from "../helpers/path-to-array";
import { getLineForPath } from "./ast";

export function getBaseForPath(docModel, pathArray) {
  let node = docModel;

  for (let i = 0; i < pathArray.length; i++) {
    node = node.value[pathArray[i]];
  }

  if (!node) {
    return "/";
  }

  //default case for not scheme-valid nodes
  return node.base || "/";
}

export function isPathValid(docModel, pathArray) {
  let node = docModel;
  let key;

  for (let i = 0; i < pathArray.length; i++) {
    key = pathArray[i];
    if (!node.value || !key) {
      return false;
    }

    node = node.value[key];
    if (!node || !node.value) {
      return false;
    }
  }

  return true;
}

//if path is incorrect, returns docModel
export function getDmNodeByPath(docModel, pathArray) {
  let node = docModel;
  let key;

  for (let i = 0; i < pathArray.length; i++) {
    key = pathArray[i];
    if (!node.value[key] || !key) {
      return null;
    }
    node = node.value[key];
  }

  return node;
}

export function getAllByBase(docModel, isBaseNeeded) {
  var nodes = [];

  find(docModel, "");

  return nodes;

  function find(docModel, pathString) {
    if (!docModel) {
      return;
    }

    if (isBaseNeeded(docModel.base)) {
      nodes.push({
        //trim first dot from path
        path: pathString.slice(1),
        nodeValue: docModel.value,
        base: docModel.base
      });
    }

    if (docModel && docModel.value && typeof docModel.value !== "string") {
      Object.keys(docModel.value).forEach(key => {
        //keys of array are indices
        find(docModel.value[key], pathString + "." + key.toString());
      });
    }
  }
}

export function getAllReferences(docModel) {
  return getAllByBase(docModel, isBaseReference);
}

export function isBaseReference(base) {
  const references = "/#/definitions/references/";

  return base && base.slice(0, references.length) === references;
}

export function getInstanceMap(docModel, base) {
  let instanceMap = {};

  getAllByBase(docModel, b => b === base).forEach((instance, index) => {
    const name = instance.path;
    instanceMap[name] = {
      name: name,
      index: index
    };
  });

  return instanceMap;
}

export function getReferencesFromNodes(
  docModel,
  editorValue,
  referenceNodes,
  linkedBase
) {
  let references = referenceNodes
    .map(({ path, nodeValue }) => {
      const fullPathArray = pathToArray(path);

      const value = pathToArray(
        getNodeByBaseInPath(docModel, linkedBase, nodeValue)
      );
      const referral = pathToArray(
        getNodeByBaseInPath(docModel, linkedBase, path)
      );

      if (value.length > 0 && referral.length > 0) {
        return {
          referral,
          referenceKey: fullPathArray.slice(-1),
          value,
          line: getLineForPath(editorValue, fullPathArray)
        };
      }
    })
    .filter(item => item);

  return references;
}

//gets pathString e.g. kotlin.features.f1.inspired_by and gets the pathString of Base===base
//kotlin.features.f1.inspired_by + "/#/definitions/language/" = kotlin
export function getNodeByBaseInPath(docModel, base, pathString) {
  const pathArray = pathToArray(pathString);
  let subPath;

  return pathArray
    .map((_, i) => {
      subPath = pathArray.slice(0, i + 1);
      let subBase = getBaseForPath(docModel, subPath);

      return base === subBase ? subPath.join(".") : null;
    })
    .filter(item => item)[0];
}

const isParentOfReferenceTo = (instance, destination) => {
  return (
    getAllReferences(instance)
      .filter(i => i.nodeValue === destination)
      .length > 0
  );
};

export const extractReferencesTo = (instance, destination) => {
  let newInstanceValue = {};
  let keys = Object.keys(instance.value);

  for (let i in keys) {
    let subInstance = instance.value[keys[i]];
    if (isParentOfReferenceTo(subInstance, destination)) {
      newInstanceValue[keys[i]] = Object.assign({}, subInstance);
    }
  }

  return {base: instance.base, value: newInstanceValue}
};