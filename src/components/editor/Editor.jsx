import React, { Component } from "react";
import PropTypes from "prop-types";

import AceEditor from "react-ace";
import editorPluginsHook
  from "../../build/editor-plugins/completers/completers-helpers/hook";
import {
  onCtrlMouseDown
} from "../../build/editor-plugins/commands/ctrl-click";
import { onCtrl } from "../../build/editor-plugins/commands/ctrl";

import "brace/mode/yaml";
import "brace/theme/tomorrow_night_eighties";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

import "./editor.css";

class Editor extends Component {
  static propTypes = {
    yamlString: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    getMatrix: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    errors: PropTypes.array,
    lineToGoTo: PropTypes.number
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      editor: null,
      value: null
    };
  }

  onChange = value => {
    this.setState({ value });

    const { setValue, onChange } = this.props;
    setValue(value);
    onChange();
  };

  onLoad = editor => {
    const { setValue, getMatrix } = this.props;
    this.setState({ editor });

    //Editor is not serializable
    //That's why it's not in redux state
    window.editor = editor;

    let session = editor.getSession();
    const value = editor.getValue();

    setValue(value);

    //Get initial matrix for building visualization
    getMatrix();

    //Disable automatic error-marker correction by ace
    session.off("change", editor.renderer.$gutterLayer.$updateAnnotations);

    //After dot completion
    editor.commands.on("afterExec", function(e, t) {
      if (e.command.name === "insertstring" && e.args === ".") {
        e.editor.execCommand("startAutocomplete");
      }
    });
    //Handle ctrl+click
    editor.on("mousedown", onCtrlMouseDown);
    //Highlight references on ctrl
    editor.on("mousemove", onCtrl);
    editor.$blockScrolling = Infinity;
    editorPluginsHook(editor, null, null || ["autosuggestApis"]);

    this.updateErrorAnnotations(this.props, editor);
  };

  updateErrorAnnotations = (nextProps, editor) => {
    if (!editor) {
      editor = this.state.editor;
    }

    if (editor && nextProps.errors) {
      const editorAnnotations = nextProps.errors.map(err => {
        // Create annotation objects that ACE can use
        return {
          row: err.line - 1,
          column: 0,
          text: err.message,
          type: "error"
        };
      });
      editor.getSession().setAnnotations(editorAnnotations);
    }
  };

  componentWillReceiveProps(nextProps) {
    const { editor } = this.state;
    const { onScroll } = this.props;

    this.updateErrorAnnotations(nextProps);
    //TODO: handle repetitive going to one line
    if (editor && nextProps.lineToGoTo) {
      editor.gotoLine(nextProps.lineToGoTo);
      onScroll();
    }
  }

  shouldComponentUpdate(nextProps) {
    const hasChanged = property => this.props[property] !== nextProps[property];

    return hasChanged("yamlString") || hasChanged("errors");
  }

  componentWillUpdate(nextProps) {
    //Get initial matrix for building visualization
    this.props.getMatrix();
  }

  render() {
    const { yamlString } = this.props;

    return (
      <AceEditor
        width="100%"
        height="100%"
        value={yamlString}
        mode="yaml"
        theme="tomorrow_night_eighties"
        onLoad={this.onLoad}
        onChange={this.onChange}
        name="ace-editor"
        tabSize={2}
        fontSize={14}
        useSoftTabs="true"
        wrapEnabled={true}
        editorProps={{
          display_indent_guides: true,
          folding: "markbeginandend",
          $useWorker: false
        }}
        setOptions={{
          fontFamily: "Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif",
          cursorStyle: "smooth",
          enableMultiselect: false
        }}
      />
    );
  }

  componentDidMount() {
    this.updateErrorAnnotations(this.props);
  }
}

export default Editor;