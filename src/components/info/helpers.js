import { getDmNodeName } from "../../build/ast/doc-model";
export const isArrayNode = node => Array.isArray(node.value);

export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

export const makeKeyPretty = key => key.split("_").map(capitalize).join(" ");

export const makeBasePretty = base =>
  capitalize(base.split("/")[base.split("/").length - 1] || base);

export const getIsContainerKey = (data, key) =>
  makeBasePretty(data.base) === makeKeyPretty(key);

export const isNestedInfoWidget = node =>
  typeof node.value === "object" && !isArrayNode(node);

export const getInstanceName = instance => {
  return getDmNodeName(instance) || makeKeyPretty(instance.pathString);
};
