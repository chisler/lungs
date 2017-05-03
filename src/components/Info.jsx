import React, { Component } from "react";
import PropTypes from "prop-types";

import "./error.css";

class Info extends Component {
  static propTypes = {
    references: PropTypes.array
  };

  render() {
    const { references } = this.props;
    return (
      <div className="errors_container">
        <ul className="list_without_bullets">
          {references.map((reference, index) => {
            if (reference.isVisible) {
              return (
                <div key={index}>
                  {reference.referral[0]}
                  {" "}
                  is
                  {" "}
                  {reference.referenceKey}

                  {" "}
                  {reference.value[0]}
                </div>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}

export default Info;
