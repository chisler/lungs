import { connect } from "react-redux";
import React from "react";

import InfoWidget from "../components/info-widget/InfoWidget";
import MutualInfoWidget from "../components/info-widget/MutualInfoWidget";
import CloseInfo from "../components/info-widget/CloseInfo";
import { chooseInstances } from "../actions";

const InfoContainer = props => {
  const { infoInstances, onCloseInfo } = props;

  switch (infoInstances.length) {
    case 1:
      return (
        <div>
          <CloseInfo onCloseInfo={onCloseInfo} />
          <InfoWidget data={infoInstances[0]} />
        </div>
      );
    case 2:
      return (
        <MutualInfoWidget
          infoInstances={infoInstances}
        />
      );
    default:
      return <div />;
  }
};

const mapStateToProps = state => {
  return {
    infoInstances: state.build.infoInstances,
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
