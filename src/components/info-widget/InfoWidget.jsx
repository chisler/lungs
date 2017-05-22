import React, { Component } from "react";
import PropTypes from "prop-types";
import "./info_widget.css";

class InfoWidget extends Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    body: PropTypes.object.isRequired,
  };


  render() {
    const { header, body } = this.props;

    return (
      <div className="info_widget">
        <div className="info_widget__header">
          {header}
        </div>
        <div className="info_widget__highlight">
          {body}
        </div>
      </div>
    );
  }
}

export default InfoWidget;
