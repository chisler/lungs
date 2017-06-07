export default function recoverEditorValue(originalPos, prefix, editorValue) {
  let pos = Object.assign({}, originalPos);
  let lines = editorValue.split("\n");
  let previousLine = lines[pos.row - 1] || "";
  let currentLine = lines[pos.row];
  let nextLine = lines[pos.row + 1] || "";
  let prepared = false;

  let prevLineIndent = getIndent(previousLine).length;
  let currLineIndent = getIndent(currentLine).length;

  if (
    (previousLine.trim()[0] === "-" || nextLine.trim()[0] === "-") &&
    currLineIndent >= prevLineIndent
  ) {
    // for arrays with existing items under it, on blank lines
    // example:
    // myArray:
    //   - a: 1
    //   | <-- user cursor
    currentLine += "- a: b"; // fake array item
    // pos.column += 1
    prepared = true;
  }

  // if current position is in at a free line with whitespace insert a fake
  // key value pair so the generated AST in ASTManager has current position in
  // editing node
  if (!prepared && currentLine.replace(prefix, "").trim() === "") {
    currentLine += "a: b"; // fake key value pair
    pos.column += 1;
    prepared = true;
  }

  if (currentLine[currentLine.length - 1] === ":") {
    // Add a space if a user doesn't put one after a colon
    // NOTE: this doesn't respect the "prepared" flag.
    currentLine += " ";
    pos.column += 1;
  }

  //if prefix is empty then add fake, empty value
  if (!prepared && !prefix) {
    // for scalar values with no values
    // i.e. "asdf: "
    currentLine += "~";
  }

  // append inserted character in currentLine for better AST results
  lines[originalPos.row] = currentLine;
  editorValue = lines.join("\n");

  return editorValue;
}

function getIndent(str) {
  let match = str.match(/^ +/);
  return match ? match[0] : "";
}
