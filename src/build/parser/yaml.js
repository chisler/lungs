import YAML from "js-yaml";

//TODO: If errors use last successful build
//TODO: tolerating errors

//Returns jsonObj and errors
export function parseYAML(yamlString) {
  let res = {
    jsonObj: null,
    error: null
  };

  try {
    res.jsonObj = YAML.safeLoad(yamlString);
  } catch (error) {
    res.error = {
      line: error.mark.line,
      message: error.message,
      scope: "parsing"
    };
  }

  return res;
}
