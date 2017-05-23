import { connect } from "react-redux";

import { resetToDefault } from "../actions";

import { Header } from "../components";
import { fork } from "../github/push";

const mapDispatchToProps = dispatch => {
  return {
    reset: () => dispatch(resetToDefault()),
    fork: fork
  };
};

//prettier-ignore
const HeaderContainer = connect(
  null,
  mapDispatchToProps)
(Header);

export default HeaderContainer;
