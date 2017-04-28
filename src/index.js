import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import Editor from './editor/components/Editor'
import Errors from './components/Errors'
import editorApp from './editor/reducers'

import "./index.css"

const store = createStore(editorApp);

const render = () => ReactDOM.render(
    <div className="container">
        <div className="editor">
            <Editor
                yamlString={store.getState().build.yamlString}
                onChange={() => store.dispatch({type: 'VALIDATE'})}
                setValue={yamlString => store.dispatch({type: 'SET_VALUE', yamlString})}
                errors={store.getState().build.errors}
                goToLine={store.getState().navigation.line}
            />
        </div>
        <div className="build">
            <Errors
                errors={store.getState().build.errors}
                onClick={line => store.dispatch({type: 'GO_TO_LINE', line})}
            />
        </div>
    </div>
    ,
    document.getElementById('root')
)

store.subscribe(render)
render()
