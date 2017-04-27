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
        if (props.yamlString) {
            this.yaml = props.yamlString
        } else {
            this.yaml = ''
        }

        this.state = {
            editor: null,
            value: this.yaml,
        }
    }

    onChange = (value) => {
        this.setState({value})

        this.props.setValue(value)
        this.props.onChange()
    }

    onLoad = (editor) => {
        let {state} = this;
        let session = editor.getSession()
        window.editor = editor;
        state.editor = editor // TODO: get editor out of state

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

        this.props.setValue(editor.getValue())
    }

    updateErrorAnnotations = (nextProps) => {
        if (this.state.editor && nextProps.errors) {
            let editorAnnotations = nextProps.errors.map(err => {
                // Create annotation objects that ACE can use
                return {
                    row: err.line,
                    column: 0,
                    type: 'error',
                    text: err.message
                }
            })
            this.state.editor.getSession().setAnnotations(editorAnnotations)
        }
    }

    componentWillMount() {
        // add user agent info to document
        // allows our custom Editor styling for IE10 to take effect
        var doc = document.documentElement
        doc.setAttribute("data-useragent", navigator.userAgent)
    }

    componentDidMount() {
        // eslint-disable-next-line react/no-did-mount-set-state
        document.addEventListener("click", this.onClick)

        if (this.props.errors) {
            this.updateErrorAnnotations(this.props)
        }
    }

    shouldComponentUpdate(nextProps) {
        // return true
        const oriYaml = this.yaml
        this.yaml = nextProps.yamlString

        return oriYaml !== nextProps.yamlString
    }

    componentWillReceiveProps(nextProps) {
                this.updateErrorAnnotations(nextProps)
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
                width="60%"
                height="100%"
                tabSize={2}
                fontSize={14}
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