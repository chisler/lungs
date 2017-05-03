import React, { Component } from "react";
import PropTypes from "prop-types";

import "./info.css";

class Info extends Component {
  static propTypes = {
    references: PropTypes.array,
    unfixReferences: PropTypes.func.isRequired,
    chooseLanguages: PropTypes.func.isRequired
  };

  render() {
    const { references, chooseLanguages, unfixReferences } = this.props;
    if (!references.some(item => item.isVisible)) {
      return <div />;
    }


    return (
      <div className="info_wrapper">
        <a
          href="#"
          className="close-button"
          onClick={() => {
            unfixReferences();
            chooseLanguages([]);
          }}
        />

        <div className="info_container">
          <ul className="list_without_bullets">
            {references.map((reference, index) => {
              if (reference.isVisible) {
                return (
                  <div className="info" key={index}>
                    {reference.referral.join(".")}
                    {" "}
                    is
                    {" "}
                    {reference.referenceKey}

                    {" "}
                    {reference.value.join(".")}
                  </div>
                );
              }
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Info;
