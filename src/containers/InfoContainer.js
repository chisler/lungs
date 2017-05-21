import { connect } from "react-redux";
import React from "react";

import InfoWidget from "../components/info-widget/InfoWidget";
import CloseInfo from "../components/info-widget/CloseInfo";
import { chooseInstances } from "../actions";

const InfoContainer = props => {
  const { data, onCloseInfo } = props;

  if (!data) {
    return <div />;
  }

  return (
    <div>
      <CloseInfo onCloseInfo={onCloseInfo}/>
      <InfoWidget data={data} />;
    </div>
  );
};

const mapStateToProps = state => {
  return {
    data: state.build.infoInstances[0]
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
