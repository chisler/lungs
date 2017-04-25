import { combineReducers } from 'redux'
import errors from './errors'
import yamlString from './yamlString'

const editorApp = combineReducers({
    errors,
    yamlString
})

export default editorApp