import { connect } from "react-redux";

import Chord from "../components/Chord";
import { chooseLanguages } from "../actions";

const mapStateToProps = state => {
  return {
    languageMatrix: state.build.languageMatrix,
    languageMap: state.build.languageMap,
    references: state.build.references
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseLanguages: chosenLanguages =>
      dispatch(chooseLanguages(chosenLanguages))
  };
};

// prettier-ignore
const D3container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chord)

export default D3container;
