import { getReferenceDestinationForPosition } from "../completers/references";
import { getLineForPath } from "../../ast/ast";
import { pathToArray } from "../../helpers/path-to-array";

import { isMac } from "../../helpers/useragent";

export function onMouseDown(e) {
  const ev = e.domEvent;
  const ctrl = ev.ctrlKey;
  const accel = e.getAccelKey();
  const editor = e.editor;
  const editorValue = editor.getValue();

  //Win: Ctrl + Click
  //Mac: Cmd + Click
  if ((accel && isMac()) || (ctrl && !isMac())) {
    const currentPos = e.getDocumentPosition();
    const referenceDestination = getReferenceDestinationForPosition(
      currentPos,
      null,
      editorValue
    );

    if (!referenceDestination) {
      return;
    }
    const destinationArray = pathToArray(referenceDestination);
    const line = getLineForPath(editorValue, destinationArray);
    console.log(referenceDestination, destinationArray, line)

    if (!line) {
      return;
    }

    editor.gotoLine(line);
    e.preventDefault();
  }
}
