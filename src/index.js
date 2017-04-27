import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import Editor from './editor/components/Editor'
import Errors from './components/Errors'
import build from './editor/reducers/build'

import "./index.css"

const store = createStore(build);
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
    <div className="container">
        <Editor
            yamlString={store.getState().yamlString}
            onChange={() => store.dispatch({type: 'VALIDATE'})}
            setValue={(yamlString) => store.dispatch({type: 'SET_VALUE', yamlString})}
            errors={store.getState().errors}
        />
        <Errors
            errors={store.getState().errors}
        />
    </div>
    ,
    rootEl
)

render()
store.subscribe(render)