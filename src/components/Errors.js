import React, { Component } from "react";
import PropTypes from "prop-types";

import Error from "./Error";

import "./error.css";

class Errors extends Component {
  static propTypes = {
    errors: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  render() {
    const { errors } = this.props;
    if (!errors.length){
      return <div/>
    }
    return (
      <div className="errors_container">
        <div>Errors: </div>
        <ul className="list_without_bullets">
          {errors.map((err, index) => {
            return (
              <Error
                key={index}
                line={err.line + 1}
                message={err.message}
                scope={err.scope}
                onClick={this.props.onClick}
              />
            );
          })}
        </ul>
      </div>
    );
  }

  componentDidUpdate() {
    this.props.onUpdate();
  }
}

export default Errors;
