import { connect } from "react-redux";

import { PullRequestForm } from "../components";
import { setPopupIsShown } from "../actions";

const mapStateToProps = state => {
  return {
    isShown: state.popup.isShown,
    yamlString: state.build.yamlString,
    errors: state.build.errors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHide: () => dispatch(setPopupIsShown(false))
  };
};

//prettier-ignore
const GitHubContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PullRequestForm);

export default GitHubContainer;
