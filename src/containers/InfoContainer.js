import { connect } from "react-redux";
import React from "react";

import {
  InstanceInfo,
  MutualInstanceInfo,
  CloseInfo
} from "../components";

import { chooseInstances } from "../actions";

const InfoContainer = props => {
  const { infoInstances, onCloseInfo } = props;

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
    infoInstances: state.build.infoInstances
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
