import YAML from "yaml-js";
import memoize from "lodash/memoize";

let cachedCompose = memoize(YAML.compose);

const MAP_TAG = "tag:yaml.org,2002:map";
const SEQ_TAG = "tag:yaml.org,2002:seq";

export function getLineForPath(yamlString, pathArray) {
  let mark = getAstNodeForPath(yamlString, pathArray);
  if (mark.tag === MAP_TAG) {
    return mark.start_mark.line;
  }
  return mark.start_mark.line + 1;
}

export function getAstNodeForPath(yamlString, pathArray) {
  let ast = cachedCompose(yamlString);

  return find(ast, pathArray, 0);

  //Recursively walks through ast cutting the start of pathArray, until it's null
  function find(current, pathArray, pathIndex) {
    let currentPath = pathArray[pathIndex];

    if (pathIndex < pathArray.length && current.tag === MAP_TAG) {
      for (let i = 0; i < current.value.length; i++) {
        let pair = current.value[i];
        let key = pair[0];
        let value = pair[1];

        if (key.value === currentPath) {
          return find(value, pathArray, pathIndex + 1);
        }
      }
    }

    if (pathIndex < pathArray.length && current.tag === SEQ_TAG) {
      let item = current.value[currentPath];

      if (item && item.tag) {
        return find(item, pathArray, pathIndex + 1);
      }
    }

    // if (current.tag === MAP_TAG) {
    return current;
    // } else {
    //     return current.start_mark.line + 1
    // }
  }
}

export function getPathForPosition(originalPos, editorValue) {
  let pos = Object.assign({}, originalPos);

  // we're always at the document root when there's no indentation,
  // so let's save some effort
  if (pos.column === 1) {
    return [];
  }

  let path = pathForPosition(editorValue, {
    line: pos.row,
    column: pos.column
  });

  return path;
}

/**
 * Get a JSON Path for position object in the spec
 * @param  {string} yaml
 * YAML or JSON string
 * @param  {object} position
 * position in the YAML or JSON string with `line` and `column` properties.
 * `line` and `column` number are zero indexed
 */
export function pathForPosition(yaml, position) {
  // Type check
  if (typeof yaml !== "string") {
    throw new TypeError("yaml should be a string");
  }
  if (
    typeof position !== "object" ||
    typeof position.line !== "number" ||
    typeof position.column !== "number"
  ) {
    throw new TypeError(
      "position should be an object with line and column" + " properties"
    );
  }

  try {
    var ast = cachedCompose(yaml);
  } catch (e) {
    console.error("Error composing AST", e);
    console.error(
      `Problem area:\n`,
      yaml.split("\n").slice(position.line - 5, position.line + 5).join("\n")
    );
    return null;
  }

  var path = [];

  return find(ast);

  /**
     * recursive find function that finds the node matching the position
     * @param  {object} current - AST object to search into
     */

  //NOTE: if position in the middle of key:
  // k|ey -  we return path of to key

  //if position in the middle of value:
  //val|ue - we return path to key of value

  function find(current) {
    // algorythm:
    // is current a promitive?
    //   // finish recursion without modifying the path
    // is current a hash?
    //   // find a key or value that position is in their range
    //     // if key is in range, terminate recursion with exisiting path
    //     // if a value is in range push the corresponding key to the path
    //     //   andcontinue recursion
    // is current an array
    //   // find the item that position is in it"s range and push the index
    //   //  of the item to the path and continue recursion with that item.

    var i = 0;

    if (!current || [MAP_TAG, SEQ_TAG].indexOf(current.tag) === -1) {
      return path;
    }

    if (current.tag === MAP_TAG) {
      for (i = 0; i < current.value.length; i++) {
        var pair = current.value[i];
        var key = pair[0];
        var value = pair[1];

        if (isInRange(key)) {
          // last key is not considered
          // path.push(key.value)
          return path;
        } else if (isInRange(value)) {
          path.push(key.value);
          return find(value);
        }
      }
    }

    if (current.tag === SEQ_TAG) {
      for (i = 0; i < current.value.length; i++) {
        var item = current.value[i];

        if (isInRange(item)) {
          path.push(i.toString());
          return find(item);
        }
      }
    }

    return path;

    /**
         * Determines if position is in node"s range
         * @param  {object}  node - AST node
         * @return {Boolean}      true if position is in node"s range
         */
    function isInRange(node) {
      /* jshint camelcase: false */

      // if node is in a single line
      if (node.start_mark.line === node.end_mark.line) {
        return (
          position.line === node.start_mark.line &&
          node.start_mark.column <= position.column &&
          node.end_mark.column + 1 >= position.column
        );
      }

      // if position is in the same line as start_mark
      if (position.line === node.start_mark.line) {
        return position.column >= node.start_mark.column;
      }

      // if position is in the same line as end_mark
      if (position.line === node.end_mark.line) {
        return position.column < node.end_mark.column;
      }

      // if position is between start and end lines return true, otherwise
      // return false.

      // < but not <= because sequence nodes end on the start mark of next
      return (
        node.start_mark.line < position.line &&
        node.end_mark.line > position.line
      );
    }
  }
}
