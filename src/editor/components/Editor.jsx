import React, { Component } from 'react';
import PropTypes from 'prop-types'

import AceEditor from 'react-ace';
import editorPluginsHook from "../editor-plugins/completers/completers-helpers/hook"

import "brace/mode/yaml"
import "brace/theme/tomorrow_night_eighties"
import "brace/ext/language_tools"
import "brace/ext/searchbox"

import "./editor.css"


//TODO: get rid of unused state agruments

class Editor extends Component {

    static propTypes = {
        yamlString: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        setValue: PropTypes.func.isRequired,
        errors: PropTypes.array
    }

    constructor(props, context) {
        super(props, context)
        if(props.yamlString) {
            this.yaml = props.yamlString
        } else {
            this.yaml = ''
        }

        this.state = {
            editor: null,
            value:  this.yaml,
        }

    }

    onChange = (value) => {
        this.setState({ value })

        this.props.setValue(value)
        this.props.onChange()
    }

    onLoad = (editor) => {
        let { state } = this;
        state.editor = editor // TODO: get editor out of state
        editor.getSession().setUseWrapMode(true)
        window.editor = editor;

        this.props.setValue(editor.getValue())

        let session = editor.getSession()

        session.on("changeScrollLeft", xPos => { // eslint-disable-line no-unused-vars
            session.setScrollLeft(0)
        })

        //After dot completion
        editor.commands.on("afterExec", function(e, t) {
            if (e.command.name === "insertstring" && e.args === "." ) {
                e.editor.execCommand("startAutocomplete");
            }
        })

        editorPluginsHook(editor, null, null || ['autosuggestApis'])

        editor.setHighlightActiveLine(false)
        editor.setHighlightActiveLine(true)

    }

    shouldComponentUpdate(nextProps) {
        const oriYaml = this.yaml
        this.yaml = nextProps.yamlString

        return oriYaml !== nextProps.yamlString
    }

    render() {
        const { yamlString, errors } = this.props
        console.log(errors)
        return (
            <AceEditor
                value={yamlString}
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