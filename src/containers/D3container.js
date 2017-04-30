import {connect} from "react-redux";

import Chord from "../components/Chord";

const mapStateToProps = (state) => {
    return {
        languageMatrix: state.build.languageMatrix,
        languageMap: state.build.languageMap,
    }
}

const D3container = connect(
    mapStateToProps,
    null
)(Chord)

export default D3container;

