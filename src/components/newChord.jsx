import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import Edges from "./Edges";
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
    const keys = Object.keys(instanceMap);

    for (let i = 0; i < keys.length; i++) {
      if (instanceMap[keys[i]].id === index) {
        return instanceMap[keys[i]].name;
      }
    }
  }

  instanceIndicesByPaths(paths) {
    const { instanceMap } = this.props;
    return paths.filter(path => instanceMap[path]).map(path => {
      return instanceMap[path].id;
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
    const { instanceMatrix, instanceMap } = this.props;
    if (!instanceMap) {
      return <div />;
    }

    let width = 400,
      height = 400,
      innerRadius = height / 2,
      outerRadius = innerRadius - 100;
    let matrix = instanceMatrix;

    (outerRadius = Math.min(width, height) * 0.5 - 40), (innerRadius =
      outerRadius - 30);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);

    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    let ribbon = d3.ribbon().radius(innerRadius);

    let displayData = chord(matrix);

    return (
      <svg width="400" height="400">
        <g id="circle">
          <g transform="translate(200,200)">
            <g className="groups">
              {displayData.groups.map((group, i) => {
                const isRotationNeeded = group.endAngle > Math.PI;
                const angle = (group.startAngle + group.endAngle) / 2;

                return (
                  <g key={i}>
                    <path
                      d={arc(group)}
                      fill={color(i)}
                      onMouseOver={() => {
                        this.chooseInstances([i]);
                      }}
                      onMouseOut={() => {
                        this.chooseInstances([]);
                      }}
                      onClick={() => {
                        this.chooseInstances([i]);
                      }}
                    />
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
                      {this.instancePathByIndex(i)}
                    </text>
                  </g>
                );
              })}
            </g>
            <g className="ribbons">
              <Edges
                displayData={displayData}
                getRibbon={ribbon}
                getFill={edge => color(edge.target.index)}
                getStroke={edge =>
                  d3.rgb(color(edge.target.index)).darker()}
                onMouseOver={edge => {
                  this.chooseInstances([
                    edge.source.index,
                    edge.target.index
                  ]);
                }}
                onMouseOut={() => {
                  this.chooseInstances([]);
                }}
                chosenInstancesIndices={this.instanceIndicesByPaths(
                  this.props.chosenInstances
                )}
              />

            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default Chord;
