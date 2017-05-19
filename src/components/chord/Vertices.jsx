import React, { Component } from "react";
import PropTypes from "prop-types";

class Vertices extends Component {
  static propTypes = {
    displayData: PropTypes.array.isRequired,
    outerRadius: PropTypes.number.isRequired,

    getArc: PropTypes.func.isRequired,
    getFill: PropTypes.func.isRequired,
    getStroke: PropTypes.func.isRequired,

    instancePathByIndex: PropTypes.func.isRequired,
    onMouseOverVertex: PropTypes.func.isRequired,
    onMouseOutVertex: PropTypes.func.isRequired,

    onClickVertex: PropTypes.func.isRequired
  };

  render() {
    const {
      displayData,
      instancePathByIndex,
      getArc,
      getFill,
      getStroke,
      onMouseOverVertex,
      onMouseOutVertex,
      onClickVertex,
      outerRadius
    } = this.props;

    return (
      <g>
        {displayData.groups.map((group, i) => {
          const isRotationNeeded = group.endAngle > Math.PI;
          const angle = (group.startAngle + group.endAngle) / 2;

          return (
            <g key={i}>
              <g key={i}>
                <path
                  d={getArc(group)}
                  fill={getFill(i)}
                  stroke={getStroke(i)}
                  onMouseOver={() => onMouseOverVertex(i)}
                  onMouseOut={() => onMouseOutVertex(i)}
                  onClick={() => onClickVertex(i)}
                />
              </g>
              <text
                transform={
                  "rotate(" +
                    (angle * 180 / Math.PI - 90) +
                    ")" +
                    "translate(" +
                    (outerRadius + 3) +
                    ")" +
                    (isRotationNeeded ? "rotate(180)" : "")
                }
                dy=".35em"
                textAnchor={isRotationNeeded ? "end" : ""}
              >
                {instancePathByIndex(i)}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
}

export default Vertices;
