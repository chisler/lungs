import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import Edges from "./Edges";
import Vertices from "./Vertices";
import "./chord.css";

class Chord extends Component {
  static propTypes = {
    instanceMatrix: PropTypes.array,
    instanceMap: PropTypes.object,

    setChosenInstances: PropTypes.func.isRequired,
    chosenInstances: PropTypes.array,

    setHoveredInstances: PropTypes.func.isRequired,
    hoveredInstances: PropTypes.array
  };

  instancePathByIndex(index) {
    const { instanceMap } = this.props;

    return this.getInstancePathByIndex(index, instanceMap);
  }

  getInstancePathByIndex(index, instanceMap) {
    const keys = Object.keys(instanceMap);

    for (let i = 0; i < keys.length; i++) {
      if (instanceMap[keys[i]].index === index) {
        return instanceMap[keys[i]].name;
      }
    }
  }

  instanceIndicesByPaths(paths) {
    const { instanceMap } = this.props;
    return paths.filter(path => instanceMap[path]).map(path => {
      return instanceMap[path].index;
    });
  }

  chooseInstances(instanceIndices) {
    const { setChosenInstances } = this.props;

    setChosenInstances([
      this.instancePathByIndex(instanceIndices[0]),
      this.instancePathByIndex(instanceIndices[1])
    ]);
  }

  hoverInstances(instanceIndices) {
    const { setHoveredInstances } = this.props;

    setHoveredInstances([
      this.instancePathByIndex(instanceIndices[0]),
      this.instancePathByIndex(instanceIndices[1])
    ]);
  }

  render() {
    const { instanceMatrix, instanceMap, hoveredInstances, chosenInstances } = this.props;
    if (!instanceMap) {
      return <div />;
    }
    const size = 400;

    const width = size, height = size;

    const outerRadius = Math.min(width, height) * 0.5 - 20;
    const innerRadius = outerRadius - 20;

    const matrix = instanceMatrix;

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbon = d3.ribbon().radius(innerRadius);

    const displayData = chord(matrix);

    return (
    <div className="Aligner">
      <svg width={size} height={size}>
        <g id="circle">
          <g transform={`translate(${size/2},${size/2})`}>
            <g className="groups">
              <Vertices
                displayData={displayData}
                outerRadius={outerRadius}

                getArc={arc}
                getFill={i => color(i)}
                getStroke={i => d3.rgb(color(i)).darker()}
                instancePathByIndex={(i) => this.getInstancePathByIndex(i, instanceMap)}

                onMouseOverVertex={i => this.hoverInstances([i])}
                onMouseOutVertex={() => this.hoverInstances([])}
                onClickVertex={i => this.chooseInstances([i])}
              />
            </g>
            <g className="ribbons">
              <Edges
                displayData={displayData}

                getRibbon={ribbon}
                getFill={edge => color(edge.target.index)}
                getStroke={edge => d3.rgb(color(edge.target.index)).darker()}

                onMouseOver={edge => this.hoverInstances([edge.source.index, edge.target.index])}
                onMouseOut={() => this.hoverInstances([])}
                chosenInstancesIndices={this.instanceIndicesByPaths(
                  chosenInstances.filter(Boolean).length ? chosenInstances : hoveredInstances
                )}
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
    );
  }
}

export default Chord;
