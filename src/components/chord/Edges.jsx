import React, { Component } from "react";
import PropTypes from "prop-types";

class Edges extends Component {
  static propTypes = {
    displayData: PropTypes.array.isRequired,
    getRibbon: PropTypes.func.isRequired,
    getFill: PropTypes.func.isRequired,
    getStroke: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onMouseOut: PropTypes.func.isRequired,
    onClickEdge: PropTypes.func.isRequired,
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
      onMouseOut,
      onClickEdge
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
        {displayData.map((edge, i) => {
          if (!shouldBeDisplayed(edge)) {
            return <g key={i} />;
          }

          return (
            <g key={i}>
              <path
                d={getRibbon(edge)}
                fill={getFill(edge)}
                stroke={getStroke(edge)}
                onMouseOver={() => onMouseOver(edge)}
                onMouseOut={() => onMouseOut(edge)}
                onClick={() =>  onClickEdge(edge)}
              />
            </g>
          );
        })}
      </g>
    );
  }
}

export default Edges;
