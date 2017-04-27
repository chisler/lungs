import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import Editor from './editor/components/Editor'
import build from './editor/reducers/build'

const store = createStore(build);
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
    <Editor
        yamlString={store.getState().yamlString}
        onChange={() => store.dispatch({ type: 'VALIDATE' })}
        setValue={(yamlString) => store.dispatch({ type: 'SET_VALUE', yamlString })}
        errors={store.getState().errors}
    />,
    rootEl
)

render()
store.subscribe(render)