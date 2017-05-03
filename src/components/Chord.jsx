import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

import "./chord.css";

class Chord extends Component {
  static propTypes = {
    languageMatrix: PropTypes.array,
    languageMap: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      chosenLanguage: null
    };
  }

  chooseLanguage(chosenLanguage) {
    this.setState({ chosenLanguage });
  }

  clearChosenLanguage() {
    const chosenLanguage = null;
    this.setState({ chosenLanguage });
  }

  render() {
    const { languageMatrix, languageMap } = this.props;

    if (!languageMap) {
      return <div />;
    }

    var width = 400,
      height = 400,
      innerRadius = height / 2,
      outerRadius = innerRadius - 100;
    var matrix = languageMatrix;

    (outerRadius = Math.min(width, height) * 0.5 - 40), (innerRadius =
      outerRadius - 30);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);

    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    var ribbon = d3.ribbon().radius(innerRadius);

    var displayData = chord(matrix);

    const findInMap = index => {
      const keys = Object.keys(languageMap);

      for (var i = 0; i < keys.length; i++) {
        if (languageMap[keys[i]].id === index) {
          return languageMap[keys[i]].name;
        }
      }
    };

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
                        this.chooseLanguage(i);
                      }}
                      onMouseOut={() => {
                        this.clearChosenLanguage();
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
                      {findInMap(i)}
                    </text>
                  </g>
                );
              })}
            </g>
            <g className="ribbons">
              {displayData.map((slice, i) => {
                const { chosenLanguage } = this.state;

                if (
                  chosenLanguage !== null &&
                  chosenLanguage !== slice.target.index &&
                  chosenLanguage !== slice.source.index
                ) {
                  return <g key={i} />;
                }

                return (
                  <g key={i}>
                    <path
                      className="chord"
                      d={ribbon(slice)}
                      fill={color(slice.target.index)}
                      stroke={d3.rgb(color(slice.target.index)).darker()}
                      onMouseOver={() => {
                        this.chooseLanguage(slice.source.index);
                      }}
                      onMouseOut={() => {
                        this.clearChosenLanguage();
                      }}
                    />
                  </g>
                );
              })}
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default Chord;
