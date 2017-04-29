import React, {Component} from 'react';
import PropTypes from 'prop-types'

import AceEditor from 'react-ace';
import editorPluginsHook from "../editor-plugins/completers/completers-helpers/hook"

import eq from "lodash/eq"
import isEmpty from "lodash/isEmpty"

import "brace/mode/yaml"
import "brace/theme/tomorrow_night_eighties"
import "brace/ext/language_tools"
import "brace/ext/searchbox"

import "./editor.css"


class Editor extends Component {

    static propTypes = {
        yamlString: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        setValue: PropTypes.func.isRequired,
        errors: PropTypes.array,
        lineToGoTo: PropTypes.number
    }

    constructor(props, context) {
        super(props, context)

        this.state = {
            editor: null,
            value: null,
        }
    }

    onChange = (value) => {
        this.setState({value})

        this.props.setValue(value)
        this.props.onChange()
    }

    onLoad = (editor) => {
        let {state, props} = this;
        state.editor = editor

        let session = editor.getSession()
        const value = editor.getValue()

        props.setValue(value)

        session.setUseWrapMode(true)
        session.on("changeScrollLeft", xPos => { // eslint-disable-line no-unused-vars
            session.setScrollLeft(0)
        })

        //Disable automatic error-marker correction by ace
        session.off("change", editor.renderer.$gutterLayer.$updateAnnotations)

        //After dot completion
        editor.commands.on("afterExec", function (e, t) {
            if (e.command.name === "insertstring" && e.args === ".") {
                e.editor.execCommand("startAutocomplete");
            }
        })

        editorPluginsHook(editor, null, null || ['autosuggestApis'])
    }

    updateErrorAnnotations = (nextProps) => {
        const {editor} = this.state

        if (editor && nextProps.errors) {
            let editorAnnotations = nextProps.errors.map(err => {
                // Create annotation objects that ACE can use
                return {
                    row: err.line,
                    column: 0,
                    text: err.message,
                    type: 'error'
                }
            })
            editor.getSession().setAnnotations(editorAnnotations)
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.updateErrorAnnotations(this.props)
    }

    shouldComponentUpdate(nextProps) {
        const {yamlString} = this.props

        return yamlString !== nextProps.yamlString
    }

    componentWillReceiveProps(nextProps) {
        const {editor} = this.state

        this.updateErrorAnnotations(nextProps)
        const hasChanged = (k) => !eq(nextProps[k], this.props[k])

        if (editor && nextProps.lineToGoTo && hasChanged("lineToGoTo")) {
            editor.gotoLine(nextProps.lineToGoTo)
        }
    }

    render() {
        const {yamlString} = this.props

        return (
            <AceEditor
                value={yamlString}
                mode="yaml"
                theme="tomorrow_night_eighties"
                onLoad={this.onLoad}
                onChange={this.onChange}
                name="ace-editor"
                tabSize={2}
                fontSize={13}
                useSoftTabs="true"
                wrapEnabled={true}
                editorProps={{
                    "display_indent_guides": true,
                    folding: "markbeginandend",
                    $useWorker: false
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