import { connect } from "react-redux";

import { resetToDefault } from "../actions";

import { Header } from "../components/header/Header"

const mapDispatchToProps = dispatch => {
  return {
    reset: () => dispatch(resetToDefault()),
  };
};

//prettier-ignore
const HeaderContainer = connect(
  null,
  mapDispatchToProps)
(Header);

export default HeaderContainer;
