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
    chosenInstances: PropTypes.array
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

  render() {
    const { instanceMatrix, instanceMap, chosenInstances } = this.props;
    if (!instanceMap) {
      return <div />;
    }

    let width = 400, height = 400;

    const matrix = instanceMatrix;

    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbon = d3.ribbon().radius(innerRadius);

    const displayData = chord(matrix);

    return (
      <svg width="400" height="400">
        <g id="circle">
          <g transform="translate(200,200)">
            <g className="groups">
              <Vertices
                displayData={displayData}
                outerRadius={outerRadius}

                getArc={arc}
                getFill={i => color(i)}
                getStroke={i => d3.rgb(color(i)).darker()}
                instancePathByIndex={(i) => this.getInstancePathByIndex(i, instanceMap)}

                onMouseOverVertex={i => this.chooseInstances([i])}
                onMouseOutVertex={() => this.chooseInstances([])}
                onClickVertex={i => this.chooseInstances([i])}
              />
            </g>
            <g className="ribbons">
              <Edges
                displayData={displayData}

                getRibbon={ribbon}
                getFill={edge => color(edge.target.index)}
                getStroke={edge => d3.rgb(color(edge.target.index)).darker()}

                onMouseOver={edge => this.chooseInstances([edge.source.index, edge.target.index])}
                onMouseOut={() => this.chooseInstances([])}
                chosenInstancesIndices={this.instanceIndicesByPaths(chosenInstances)}
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default Chord;
