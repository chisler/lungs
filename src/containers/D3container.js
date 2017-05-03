import { connect } from "react-redux";

import Chord from "../components/Chord";
import { chooseOneLanguage } from "../actions";

const mapStateToProps = state => {
  return {
    languageMatrix: state.build.languageMatrix,
    languageMap: state.build.languageMap,
    references: state.build.references
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseOneLanguage: chosenLanguage =>
      dispatch(chooseOneLanguage(chosenLanguage))
  };
};

// prettier-ignore
const D3container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chord)

export default D3container;
