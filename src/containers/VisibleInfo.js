import { connect } from "react-redux";

import Info from "../components/Info";

const mapStateToProps = state => {
  return {
    references: state.build.references
  };
};

// prettier-ignore
const VisibleInfo = connect(
  mapStateToProps,
  null)
(Info)

export default VisibleInfo;
