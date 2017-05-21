import React, { Component } from "react";
import PropTypes from "prop-types";

import "./info-widget/close_info.css";

class Info extends Component {
  static propTypes = {
    references: PropTypes.array,
    unfixReferences: PropTypes.func.isRequired,
    chooseLanguages: PropTypes.func.isRequired,
    goToLine: PropTypes.func.isRequired
  };

  render() {
    const { references, chooseLanguages, unfixReferences, goToLine } = this.props;
    if (!references || !references.some(item => item.isVisible)) {
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
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        goToLine(reference.line);
                      }}
                    >
                      Line {reference.line}
                    </a>:
                    {" "}
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
