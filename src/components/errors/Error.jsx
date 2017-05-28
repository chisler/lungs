import React, { Component } from "react";
import PropTypes from "prop-types";

import "./error.css";

class Error extends Component {
  static propTypes = {
    line: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  handleClick = () => {
    this.props.onClick(this.props.line);
  };

  render() {
    const { line, message } = this.props;

    return (
      <div className="errors__body">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            this.handleClick();
          }}
        >
          Line {line}
        </a>: {message}
      </div>
    );
  }
}

export default Error;
