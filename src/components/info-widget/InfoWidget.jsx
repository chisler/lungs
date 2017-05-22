import React, { Component } from "react";
import PropTypes from "prop-types";
import "./info_widget.css";

class InfoWidget extends Component {
  static propTypes = {
    base: PropTypes.string.isRequired,
    body: PropTypes.element.isRequired,
  };


  render() {
    const { base, body } = this.props;

    return (
      <div className="info_widget">
        {base ? <div className="info_widget__header"> {base}</div> : null}
        <div className="info_widget__body">
          {body}
        </div>
      </div>
    );
  }
}

export default InfoWidget;
