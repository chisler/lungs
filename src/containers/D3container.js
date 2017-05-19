import { connect } from "react-redux";

import newChord from "../components/newChord";
import { chooseInstances } from "../actions";

const mapStateToProps = state => {
  return {
    instanceMatrix: state.build.instanceMatrix,
    instanceMap: state.build.instanceMap,
    chosenInstances: state.build.chosenInstances
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setChosenInstances: chosenInstances =>
      dispatch(chooseInstances(chosenInstances)),
  };
};

// prettier-ignore
const D3container = connect(
  mapStateToProps,
  mapDispatchToProps
)(newChord);

export default D3container;
