import { connect } from "react-redux";

import Errors from "../components/Errors";
import { setLineToGoTo } from "../actions";
import {resizeEditor} from "../actions/index";

const sortedByLine = errors => {
  const comparator = (e1, e2) => {
    return e1.line > e2.line;
  };

  let sortedErrors = Object.assign([], errors);

  sortedErrors.sort(comparator);
  return sortedErrors;
};

const mapStateToProps = state => {
  return {
    errors: sortedByLine(state.build.errors)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: line => dispatch(setLineToGoTo(line)),
    onUpdate: () => window.editor.resize()
  };
};

//prettier-ignore
const SortedErrors = connect(
    mapStateToProps,
    mapDispatchToProps
)(Errors)

export default SortedErrors;
