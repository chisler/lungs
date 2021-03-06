import React, { Component } from "react";
import PropTypes from "prop-types";

import InstanceInfo from "./InstanceInfo";
import InfoWidget from "./InfoWidget";

import { extractReferencesTo } from "../../build/ast/doc-model";
import { getInstanceName } from "./helpers";

const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};

const MutualInfoTitle = props => {
  const { instance0, instance1 } = props;

  const name0 = getInstanceName(instance0);
  const name1 = getInstanceName(instance1);

  return (
    <h2>
      {`${name0} -> ${name1}`}
    </h2>
  );
};

const OneDirectionInfo = props => {
  const { referenceData, instance0, instance1 } = props;
  return (
    <div>
      <MutualInfoTitle instance0={instance0} instance1={instance1} />
      {isObjectEmpty(referenceData.value)
        ? "No references"
        : <InstanceInfo data={referenceData} />}
    </div>
  );
};

class MutualInstanceInfo extends Component {
  static propTypes = {
    infoInstances: PropTypes.array.isRequired
  };

  render() {
    const { infoInstances } = this.props;

    const [path0, path1] = [
      infoInstances[0].pathString,
      infoInstances[1].pathString
    ];

    const forward = extractReferencesTo(infoInstances[0], path1);
    const backward = extractReferencesTo(infoInstances[1], path0);

    const body = (
      <div>
        <OneDirectionInfo
          instance0={infoInstances[0]}
          instance1={infoInstances[1]}
          referenceData={forward}
        />
        <hr />
        <OneDirectionInfo
          instance0={infoInstances[1]}
          instance1={infoInstances[0]}
          referenceData={backward}
        />
      </div>
    );

    return <InfoWidget base="Mutual References" body={body} />;
  }
}
export default MutualInstanceInfo;
