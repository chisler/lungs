export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

export const makeKeyPretty = key => key.split("_").map(capitalize).join(" ");

export const makeBasePretty = base =>
  capitalize(base.split("/")[base.split("/").length - 1] || base);

export const getIsContainerKey = (data, key) =>
  makeBasePretty(data.base) === makeKeyPretty(key);

export const isNestedInfoWidget = node =>
  typeof node.value === "object" && !(node.value instanceof Array);