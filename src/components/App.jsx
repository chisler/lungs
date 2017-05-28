import React, { Component } from "react";

import PropTypes from "prop-types";
import { EditorMode, DisplayMode } from "./index";

import { isEditorMode } from "../reducers/constants";

class App extends Component {
  render() {
    return (
      <div>
        {isEditorMode(this.props.mode) ? <EditorMode /> : <DisplayMode />}
      </div>
    );
  }
  componentDidMount() {
    this.props.initialBuild();
  }
}

App.propTypes = {
  mode: PropTypes.number.isRequired
};

export default App;
