import { connect } from "react-redux";

import {
  setDisplayMode,
  setEditorMode,
  setPopupIsShown,

  resetToDefault,
  fetchYamlSync
} from "../actions";

import { Header } from "../components";
import {} from "../actions/index";

const mapStateToProps = state => {
  return {
    mode: state.mode.mode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reset: () => dispatch(resetToDefault()),
    fetchYaml: () => dispatch(fetchYamlSync()),
    onClickSendPR: () => dispatch(setPopupIsShown(true)),
    setDisplayMode: () => dispatch(setDisplayMode()),
    setEditorMode: () => dispatch(setEditorMode())
  };
};

//prettier-ignore
const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default HeaderContainer;
