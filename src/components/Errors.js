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
    if (!errors.length) {
      return <div />;
    }
    return (
      <div>
        <div className="errors__header">Errors</div>
        <div className="errors_container">
          {errors.map((err, index) => {
            return (
                <Error
                  key={index}
                  line={err.line}
                  message={err.message}
                  scope={err.scope}
                  onClick={this.props.onClick}
                />
            );
          })}
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.props.onUpdate();
  }
}

export default Errors;
