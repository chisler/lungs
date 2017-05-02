import React, {Component} from "react";
import * as d3 from 'd3'
import PropTypes from "prop-types";

import "./chord.css";

class Chord extends Component {

    static propTypes = {
        languageMatrix: PropTypes.array,
        languageMap: PropTypes.object
    }

    render() {
        const {languageMatrix, languageMap} = this.props;

        if (!languageMap) {
            return (<div></div>)
        }

        var width = 400, height = 400, innerRadius = height / 2, outerRadius = innerRadius - 100;
        var matrix = languageMatrix

        outerRadius = Math.min(width, height) * 0.5 - 40,
            innerRadius = outerRadius - 30;

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var chord = d3.chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending);

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var ribbon = d3.ribbon()
            .radius(innerRadius);

        var displayData = chord(matrix)

        const findInMap = (index) => {
            const keys = Object.keys(languageMap);

            for (var i = 0; i < keys.length; i++) {
                if (languageMap[keys[i]].id === index) {
                    return languageMap[keys[i]].name
                }
            }
        }
        console.log(displayData)

        return (
            <svg width="400" height="400">
                <g id="circle">
                    <g transform="translate(200,200)">
                        <g className="groups">
                            {displayData.groups.map((slice, i) => {
                                    const isRotationNeeded = (slice.endAngle) > Math.PI
                                    const angle = (slice.startAngle + slice.endAngle) / 2

                                    return (<g key={i}>
                                        <path
                                            d={arc(slice)}
                                            fill={color(i)}
                                        />
                                        <text
                                            transform={"rotate(" + ( angle * 180 / Math.PI - 90) + ")"
                                            + "translate(" + (outerRadius + 3) + ")"
                                            + (isRotationNeeded ? "rotate(180)" : "")}
                                            dy=".35em"
                                            textAnchor={isRotationNeeded ? "end" : ""}
                                        >
                                            {findInMap(i)}
                                        </text>
                                    </g>)
                                }
                            )}
                        </g>
                        <g className="ribbons">
                            {displayData.map((slice, i) =>
                                <g key={i}>
                                    <path
                                        className="chord"
                                        d={ribbon(slice)}
                                        fill={color(slice.target.index)}
                                        stroke={d3.rgb(color(slice.target.index)).darker()}
                                    />
                                </g>
                            )}
                        </g>
                    </g>
                </g>
            </svg>
        )
    }
}

export default Chord;

