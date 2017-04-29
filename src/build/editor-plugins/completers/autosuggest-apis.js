import {makeAutosuggest} from "./completers-helpers/core";
import constructAceCompletion from "./completers-helpers/construct-ace-completion";
import {getKeywordsForPosition} from "./keywords";
import {getReferenceCompletionsForPosition} from "./references";

export default function(editor) {

  let KeywordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
      editor.completer.autoSelect = true

      let editorValue = session.getValue()

      let array = getKeywordsForPosition(pos, prefix, editorValue)

      let completions = array.map(key => { return constructAceCompletion("Keyword", key)})

      callback(null, completions)
    }
  }

  let ReferenceCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
      editor.completer.autoSelect = true

      let editorValue = session.getValue()

      let array = getReferenceCompletionsForPosition(pos, prefix, editorValue) //["SCALA", "KOTLIN"]

      let completions = array.map(key => { return constructAceCompletion("Reference", key)})

      callback(null, completions)
    }
  }
  return makeAutosuggest({
    completers: [KeywordCompleter, ReferenceCompleter]
  })(editor)
}