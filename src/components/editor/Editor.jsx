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

import isEqual from "lodash/isEqual";

import "./editor.css";

class Editor extends Component {
  static propTypes = {
    yamlString: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    getMatrix: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    fetchYaml: PropTypes.func.isRequired,
    errors: PropTypes.array,
    lineToGoTo: PropTypes.number
  };

  state = {
    editor: null
  };

  rebuild() {
    const { onChange, getMatrix } = this.props;

    onChange();
    getMatrix();
  }

  onChange(value) {
    this.props.setValue(value);
  }

  onLoad(editor) {
    this.setState({ editor });

    //Editor is not serializable
    //That's why it's not in redux state
    window.editor = editor;

    let session = editor.getSession();
    const value = editor.getValue();

    this.props.setValue(value);
    this.rebuild();

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
  }

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

    if (editor && nextProps.lineToGoTo) {
      editor.gotoLine(nextProps.lineToGoTo);
      onScroll();
    }
  }

  shouldComponentUpdate(nextProps) {
    const hasChanged = property =>
      !isEqual(this.props[property], nextProps[property]);

    const y = hasChanged("yamlString"), e = hasChanged("errors");

    return y || e;
  }

  componentWillUpdate(nextProps) {
    //Get initial matrix for building visualization
    this.rebuild(nextProps.yamlString);
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
        onLoad={this.onLoad.bind(this)}
        onChange={this.onChange.bind(this)}
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

    const { yamlString, fetchYaml } = this.props;

    if (!yamlString) {
      fetchYaml();
    }
  }
}

export default Editor;
