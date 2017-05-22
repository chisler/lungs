import React, { Component } from "react";
import PropTypes from "prop-types";
import { extractReferencesTo } from "../../build/ast/doc-model";
import InfoWidget from "./InfoWidget";

//Accepts map
//Map = children, else = its properties

const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};

class MutualInfoWidget extends Component {
  static propTypes = {
    infoInstances: PropTypes.array.isRequired
  };

  render() {
    const { infoInstances } = this.props;

    const [path0, path1] = [
      infoInstances[0].pathString,
      infoInstances[1].pathString
    ];

    const forwardDirection = (
      <div>
        {`${path0}'s references to ${path1}`}
      </div>
    );
    const backwardDirection = (
      <div>
        {`${path1} references to ${path0}`}
      </div>
    );

    const forward = extractReferencesTo(infoInstances[0], path1);
    const backward = extractReferencesTo(infoInstances[1], path0);

    console.log(isObjectEmpty(forward), isObjectEmpty(backward));
    return (
      <div>
        {forwardDirection}
        {isObjectEmpty(forward.value) ? "No references" : <InfoWidget data={forward} />}

        {backwardDirection}
        {isObjectEmpty(backward.value) ? "No references" : <InfoWidget data={backward} />}
      </div>
    );
  }
}
export default MutualInfoWidget;
