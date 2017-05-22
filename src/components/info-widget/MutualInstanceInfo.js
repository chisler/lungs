import React, { Component } from "react";
import PropTypes from "prop-types";
import { extractReferencesTo, getDmNodeName } from "../../build/ast/doc-model";
import InstanceInfo from "./InstanceInfo";
import { makeKeyPretty } from "./helpers";
import InfoWidget from "./InfoWidget";

const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};

const MutualInfoTitle = props => {
  const { instance0, instance1 } = props;

  const name0 = getDmNodeName(instance0) || makeKeyPretty(instance0.pathString);
  const name1 = getDmNodeName(instance1) || makeKeyPretty(instance1.pathString);

  return (
    <h2>
      {`${name0}'s references to ${name1}`}
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

    const forward = extractReferencesTo(infoInstances[0], path1);
    const backward = extractReferencesTo(infoInstances[1], path0);

    const body = (
      <div>
        <OneDirectionInfo
          instance0={infoInstances[0]}
          instance1={infoInstances[1]}
          referenceData={forward}
        />
        <OneDirectionInfo
          instance0={infoInstances[1]}
          instance1={infoInstances[0]}
          referenceData={backward}
        />
      </div>
    );

    return <InfoWidget header="Mutual References" body={body} />;
  }
}
export default MutualInfoWidget;
