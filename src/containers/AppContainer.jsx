import { connect } from "react-redux";

import { extractInstanceMap } from "../actions";
import { App } from "../components";

const mapStateToProps = state => {
  return {
    mode: state.mode.mode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initialBuild: () => dispatch(extractInstanceMap())
  };
};

// prettier-ignore
const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
