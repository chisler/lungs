import React, { Component } from "react";
import PropTypes from "prop-types";

class Vertexes extends Component {
  static propTypes = {
    displayData: PropTypes.array.isRequired,
    getRibbon: PropTypes.func.isRequired,
    getFill: PropTypes.func.isRequired,
    getStroke: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onMouseOut: PropTypes.func.isRequired,
    chosenInstancesIndices: PropTypes.array
  };

  render() {
    const {
      displayData,
      chosenInstancesIndices,
      getRibbon,
      getFill,
      getStroke,
      onMouseOver,
      onMouseOut
    } = this.props;

    const shouldBeDisplayed = vertex => {
      const chosenIds = chosenInstancesIndices;

      return !//1 chosen => only its vertexes should be displayed
      ((chosenIds.length === 1 &&
        !(chosenIds.includes(vertex.target.index) ||
          chosenIds.includes(vertex.source.index))) ||
        //2 chose => their common vertex should by displayed only
        (chosenIds.length === 2 &&
          !(chosenIds.includes(vertex.target.index) &&
            chosenIds.includes(vertex.source.index))));
    };

    return (
      <g>
        {displayData.map((vertex, i) => {
          if (!shouldBeDisplayed(vertex)) {
            return <g key={i} />;
          }

          return (
            <g key={i}>
              <path
                d={getRibbon(vertex)}
                fill={getFill(vertex)}
                stroke={getStroke(vertex)}
                onMouseOver={() => onMouseOver(vertex)}
                onMouseOut={() => onMouseOut(vertex)}
              />
            </g>
          );
        })}
      </g>
    );
  }
}

export default Vertexes;
