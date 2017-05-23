import { connect } from "react-redux";

import { resetToDefault } from "../actions";

import { Header } from "../components";
import { fork } from "../github/push";
import {setPopupIsShown} from "../actions/index";

const mapDispatchToProps = dispatch => {
  return {
    reset: () => dispatch(resetToDefault()),
    onClickSendPR: () => dispatch(setPopupIsShown(true))
  };
};

//prettier-ignore
const HeaderContainer = connect(
  null,
  mapDispatchToProps)
(Header);

export default HeaderContainer;
