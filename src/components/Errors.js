import React, { Component } from "react";
import PropTypes from "prop-types";

import Error from "./Error";

import "./error.css";

class Errors extends Component {
  static propTypes = {
    errors: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
  };

  render() {
    const { errors } = this.props;
    return (
      <div className="errors_container">
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
}

export default Errors;
