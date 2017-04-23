export function makeAutosuggest({ completers = [] }) {
  //eslint-disable-next-line no-unused-vars
  return function(editor) {
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    })

    editor.completers = completers
  }
}
