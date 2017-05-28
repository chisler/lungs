import { connect } from "react-redux";

import {
  setDisplayMode,
  setEditorMode,
  resetToDefault,
  setPopupIsShown
} from "../actions";

import { Header } from "../components";

const mapStateToProps = state => {
  return {
    mode: state.mode.mode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reset: () => dispatch(resetToDefault()),
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
