import React, { Component } from 'react';
import AceEditor from 'react-ace';
import editorPluginsHook from "../editor-plugins/completers/completers-helpers/hook"

import eq from "lodash/eq"
import isEmpty from "lodash/isEmpty"

import "brace/mode/yaml"
import "brace/theme/tomorrow_night_eighties"
import "brace/ext/language_tools"
import "brace/ext/searchbox"

import "./editor.css"

const mockYAML = `kotlin:
  name: Kotlin
  description: This is a great thing!
  creator: 12
  people:
    - Andrey Breslav
    - 1
    - Roman Elizarov
  features:
    val_var:
        inspired_by: kotlin.features.
        description: Some features have their own description or rationale.
    types_on_the_right: 
        inspired_by: kotlin.features.f
        description: Some features have their own description or rationale.
`;

class Editor extends Component {

    constructor(props, context) {
        super(props, context)
        if(props.value) {
            this.yaml = mockYAML || props.value
        } else {
            this.yaml = mockYAML
        }
        this.state = {
            editor: null,
            value:  this.yaml,
        }

    }

    onChange = (value) => {
        // Set the value in state, now - so that we don't have lag
        this.setState({ value })
        // Send it upstream
        // this.props.onChange(value)
    }

    onLoad = (editor) => {
        let { props, state } = this;
        state.editor = editor // TODO: get editor out of state
        editor.getSession().setUseWrapMode(true)
        window.editor = editor;
        let session = editor.getSession()

        session.on("changeScrollLeft", xPos => { // eslint-disable-line no-unused-vars
            session.setScrollLeft(0)
        })

        //After dot completion
        editor.commands.on("afterExec", function(e, t) {
            if (e.command.name == "insertstring" && e.args == "." ) {
                e.editor.execCommand("startAutocomplete");
            }
        })

        editorPluginsHook(editor, null, null || ['autosuggestApis'])

        editor.setHighlightActiveLine(false)
        editor.setHighlightActiveLine(true)

    }


    updateErrorAnnotations = (nextProps) => {
        if(this.state.editor && nextProps.errors) {
            let editorAnnotations = nextProps.errors.toJS().map(err => {
                // Create annotation objects that ACE can use
                return {
                    row: err.line - 1,
                    column: 0,
                    type: err.level,
                    text: err.message
                }
            })

            this.state.editor.getSession().setAnnotations(editorAnnotations)
        }
    }

    setReadOnlyOptions = (nextProps) => {
        let { state } = this

        if(nextProps.readOnly === true && state.editor) {
            state.editor.setOptions({
                readOnly: true,
                highlightActiveLine: false,
                highlightGutterLine: false
            })
        } else if(state.editor) {
            state.editor.setOptions({
                readOnly: false,
                highlightActiveLine: true,
                highlightGutterLine: true
            })
        }
    }

    updateMarkerAnnotations = (nextProps, { force } = {}) => {
        // let { state } = this
        // let { onMarkerLineUpdate } = nextProps
        //
        // let size = obj => Object.keys(obj).length
    }

    componentWillMount() {
        // add user agent info to document
        // allows our custom Editor styling for IE10 to take effect
        var doc = document.documentElement
        doc.setAttribute("data-useragent", navigator.userAgent)
    }

    componentDidMount() {
        // eslint-disable-next-line react/no-did-mount-set-state
        // this.setState({ width: this.getWidth() })
        document.addEventListener("click", this.onClick)

        if(this.props.markers) {
            this.updateMarkerAnnotations({ markers: this.props.markers }, { force: true })
        }
    }

    componentWillReceiveProps(nextProps) {
        let { state } = this
        let hasChanged = (k) => !eq(nextProps[k], this.props[k])
        let wasEmptyBefore = (k) => nextProps[k] && (!this.props[k] || isEmpty(this.props[k]))

        this.updateErrorAnnotations(nextProps)
        this.setReadOnlyOptions(nextProps)
        this.updateMarkerAnnotations(nextProps)

        if(state.editor && nextProps.goToLine && hasChanged("goToLine")) {
            state.editor.gotoLine(nextProps.goToLine.line)
        }

        this.setState({
            shouldClearUndoStack: hasChanged("specId") || wasEmptyBefore("value"),
        })

    }

    yaml = this.yaml || "";


    shouldComponentUpdate(nextProps) {
        return false
        // const oriYaml = this.yaml
        // this.yaml = nextProps.value
        //
        // return oriYaml !== nextProps.value
    }

    render() {
        const value = this.yaml

        return (
            <AceEditor
                value={value}
                mode="yaml"
                theme="tomorrow_night_eighties"
                onLoad={this.onLoad}
                onChange={this.onChange}
                name="ace-editor"
                width="100%"
                height="100%"
                tabSize={2}
                fontSize={14}
                useSoftTabs="true"
                wrapEnabled={true}
                editorProps={{
                    "display_indent_guides": true,
                    folding: "markbeginandend"
                }}
                setOptions={{
                    cursorStyle: "smooth",
                    wrapBehavioursEnabled: true
                }}
            />
        )
    }
}

export default Editor;
