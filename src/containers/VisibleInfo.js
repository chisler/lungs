import { connect } from "react-redux";

import Info from "../components/Info";
import { chooseLanguages, unfixReferences, setLineToGoTo } from "../actions";

const mapStateToProps = state => {
  return {
    references: state.build.references
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseLanguages: chosenLanguages =>
      dispatch(chooseLanguages(chosenLanguages)),
    unfixReferences: () => dispatch(unfixReferences()),
    goToLine: line => dispatch(setLineToGoTo(line))
  };
};

// prettier-ignore
const VisibleInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(Info)

export default VisibleInfo;
