import React from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import EditorContainer from "./containers/EditorContainer";
import SortedErrors from "./containers/SortedErrors";
import editorApp from "./reducers";
import {Provider} from "react-redux";


import "./index.css";

ReactDOM.render(
    <Provider store={createStore(editorApp)}>
        <div className="container">
            <div className="editor">
                <EditorContainer />
            </div>
            <div className="build">
                <SortedErrors />
            </div>
        </div>
    </Provider>
    ,
    document.getElementById('root')
)