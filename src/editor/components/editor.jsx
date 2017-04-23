import React, { Component } from 'react';
import AceEditor from 'react-ace';
import editorPluginsHook from "../editor-plugins/completers/hook"

import "brace/mode/yaml"
import "brace/theme/tomorrow_night_eighties"
import "brace/ext/language_tools"
import "brace/ext/searchbox"

import "./editor.css"

class Editor extends Component {

    constructor(props, context) {
        super(props, context)
        if(props.value) {
            this.yaml = props.value
        }
        this.state = {
            editor: null,
            value: props.value || "",
        }

        // see https://gist.github.com/Restuta/e400a555ba24daa396cc
        // this.onClick = this.onClick.bind(this)
    }

    onChange = (value) => {
        // Set the value in state, now - so that we don't have lag
        this.setState({ value })
        // Send it upstream
        // this.props.onChange(value)
    }

    onLoad = (editor) => {
        let { props, state } = this

        state.editor = editor // TODO: get editor out of state
        editor.getSession().setUseWrapMode(true)

        let session = editor.getSession()

        session.on("changeScrollLeft", xPos => { // eslint-disable-line no-unused-vars
            session.setScrollLeft(0)
        })

        editorPluginsHook(editor, null, null || ['autosuggestApis'])

        editor.setHighlightActiveLine(false)
        editor.setHighlightActiveLine(true)
    }

    yaml = this.yaml || "";

    shouldComponentUpdate(nextProps) {
        const oriYaml = this.yaml
        this.yaml = nextProps.value

        return oriYaml !== nextProps.value
    }

    componentDidUpdate() {
        let { shouldClearUndoStack, editor } = this.state

        if(shouldClearUndoStack) {
            setTimeout(function () {
                editor.getSession().getUndoManager().reset()
            }, 100)
        }

    }

    componentWillUnmount() {
        document.removeEventListener("click", this.onClick)
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
