import { connect } from "react-redux";
import React from "react";

import InfoWidget from "../components/info-widget/InfoWidget";

const InfoContainer = props => {
  const { data } = props;

  if (!data) {
    return <div />;
  }

  return <InfoWidget data={data} />;
};

const mapStateToProps = state => {
  return {
    data: state.build.infoInstances[0]
  };
};

// prettier-ignore
export default connect(
  mapStateToProps
)(InfoContainer);