import { connect } from "react-redux";
import React from "react";

import { InstanceInfo, MutualInstanceInfo, CloseInfo } from "../components";
import { getInfoInstances } from "../build/helpers/get-info-instances";
import { chooseInstances } from "../actions";

const InfoContainer = props => {
  const { yamlString, chosenInstances, hoveredInstances, onCloseInfo } = props;

  const infoInstances = getInfoInstances(
    yamlString,
    chosenInstances.length ? chosenInstances : hoveredInstances
  );

  switch (infoInstances.length) {
    case 1:
      return (
        <div>
          <CloseInfo onCloseInfo={onCloseInfo} />
          <InstanceInfo data={infoInstances[0]} />
        </div>
      );
    case 2:
      return (
        <div>
          <CloseInfo onCloseInfo={onCloseInfo} />
          <MutualInstanceInfo infoInstances={infoInstances} />
        </div>
      );
    default:
      return <div />;
  }
};

const mapStateToProps = state => {
  return {
    yamlString: state.build.yamlString,
    chosenInstances: state.build.chosenInstances,
    hoveredInstances: state.build.hoveredInstances
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCloseInfo: () => dispatch(chooseInstances([]))
  };
};

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoContainer);
