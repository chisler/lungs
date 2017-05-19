import { connect } from "react-redux";

import newChord from "../components/chord/newChord";
import { chooseInstances, hoverInstances } from "../actions";

const mapStateToProps = state => {
  return {
    instanceMatrix: state.build.instanceMatrix,
    instanceMap: state.build.instanceMap,

    chosenInstances: state.build.chosenInstances,

    hoveredInstances: state.build.hoveredInstances
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setChosenInstances: chosenInstances =>
      dispatch(chooseInstances(chosenInstances)),
    setHoveredInstances: hoveredInstances  =>
      dispatch(hoverInstances(hoveredInstances)),
  };
};

// prettier-ignore
const D3container = connect(
  mapStateToProps,
  mapDispatchToProps
)(newChord);

export default D3container;
