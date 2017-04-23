import { makeAutosuggest } from "./core"

export default function(editor) {

  let KeywordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
      editor.completer.autoSelect = true

      let editorValue = session.getValue()

      let currentLine = editorValue.split("\n")[pos.row]

      let array = ["SCALA", "KOTLIN"]

      let completions = array.map(key => { return constructAceCompletion(null, key)})

      callback(null, completions)
    }
  }
  return makeAutosuggest({
    completers: [KeywordCompleter]
  })(editor)
}

function constructAceCompletion(meta, keyword) {
    if(keyword.slice(0, 2) === "__") {
        return {}
    }

    return {
        name: keyword,
        value: keyword,
        score: 300,
        meta: meta || "keyword"
    }
}