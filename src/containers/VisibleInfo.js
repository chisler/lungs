import { connect } from "react-redux";

import Info from "../components/Info";
import { chooseLanguages, unfixReferences } from "../actions";

const mapStateToProps = state => {
  return {
    references: state.build.references
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseLanguages: chosenLanguages =>
      dispatch(chooseLanguages(chosenLanguages)),
    unfixReferences: () =>
      dispatch(unfixReferences())
  };
};

// prettier-ignore
const VisibleInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(Info)

export default VisibleInfo;
