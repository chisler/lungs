import ace from "brace";
const { Range } = ace.acequire("ace/range");
import { getReferenceDestinationForPosition } from "../completers/references";
import { isMac } from "../../helpers/useragent";

let currentMarker;

export function onCtrl(e) {
  const ev = e.domEvent;
  const ctrl = ev.ctrlKey;
  const accel = e.getAccelKey();
  const editor = e.editor;
  const editorValue = editor.getValue();

  //Remove the old marker
  editor.session.removeMarker(currentMarker);

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

    const { line, column } = referenceDestination.referenceStartPos;

    currentMarker = editor.session.addMarker(
      new Range(line, column, line, column + referenceDestination.endIndex),
      "ace_link_marker",
      "text",
      true
    );
  }
}
