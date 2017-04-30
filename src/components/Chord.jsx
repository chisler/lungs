import React, {Component} from "react";
import * as d3 from 'd3'
import * as _ from 'underscore'
import ReactFauxDOM from 'react-faux-dom'
import PropTypes from "prop-types";

import "./chord.css";

class Chord extends Component {

    static propTypes = {
        languageMatrix: PropTypes.array,
        languageMap: PropTypes.object
    }

    //TODO: get rid of underscore
    chordRdr (matrix, mmap) {
        return function (d) {
            var i, j, s, t, g, m = {};
            if (d.source) {
                i = d.source.index;
                j = d.target.index;
                s = _.where(mmap, {id: i});
                t = _.where(mmap, {id: j});
                m.sname = s[0].name;
                m.sdata = d.source.value;
                m.svalue = +d.source.value;
                m.stotal = _.reduce(matrix[i], function (k, n) {
                    return k + n
                }, 0);
                m.tname = t[0].name;
                m.tdata = d.target.value;
                m.tvalue = +d.target.value;
                m.ttotal = _.reduce(matrix[j], function (k, n) {
                    return k + n
                }, 0);
            } else {
                g = _.where(mmap, {id: d.index});
                m.gname = g[0].name;
                m.gdata = g[0].data;
                m.gvalue = d.value;
            }
            m.mtotal = _.reduce(matrix, function (m1, n1) {
                return m1 + _.reduce(n1, function (m2, n2) {
                        return m2 + n2
                    }, 0);
            }, 0);
            return m;
        }
    }

    render () {
        const { languageMatrix, languageMap } = this.props;

        if (!languageMap) {
            return (<div></div>)
        }

        // Create your element.
        var faux = ReactFauxDOM.createElement('div')

        var formatValue = d3.formatPrefix(",.0", 1e3);
        var matrix = languageMatrix
        var mmap = languageMap

        var w = 300, h = 400, r1 = h / 2, r0 = r1 - 100;

        var fill = d3.scaleOrdinal()
            .domain(d3.range(4))
            .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

        var chord = d3.chord()
            .padAngle(.02)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        var arc = d3.arc()
            .innerRadius(r0)
            .outerRadius(r0 + 20);

        var svg = d3.select(faux).append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("id", "circle")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var rdr = this.chordRdr(matrix, mmap);
        console.log(rdr)
        var g = svg
            .datum(chord(matrix));

        var group = g.append("g")
            .attr("class", "groups")
            .selectAll("g")
            .data(function (chords) {
                return chords.groups;
            })
            .enter().append("g");

        group.append("path")
            .style("stroke", "black")
            .style("fill", function (d) {
                return fill(d.index);
            })
            .attr("d", arc)
            .on("mouseover", mouseover)
            .on("mouseout", function (d) {
                d3.select("#tooltip").style("visibility", "hidden")
            });


        group.append("svg:text")
            .each(function (d) {
                d.angle = (d.startAngle + d.endAngle) / 2;
            })
            .attr("dy", ".35em")
            .style("font-family", "helvetica, arial, sans-serif")
            .style("font-size", "10px")
            .attr("text-anchor", function (d) {
                return d.angle > Math.PI ? "end" : null;
            })
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + (r0 + 26) + ")"
                    + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text(function (d) {
                return rdr(d).gname;
            });

        var chordPaths = g.append("g")
            .attr("class", "ribbons")
            .selectAll("path")
            .data(function (chords) {
                return chords;
            })
            .enter().append("path")
            .attr("class", "chord")
            .style("stroke", function (d) {
                return d3.rgb(fill(d.target.index)).darker();
            })
            .style("fill", function (d) {
                return fill(d.target.index);
            })
            .attr("d", d3.ribbon().radius(r0))
            .on("mouseover", function (d) {
                d3.select("#tooltip")
                    .style("visibility", "visible")
                    .html(chordTip(rdr(d)))
                    .style("top", function () {
                        return (d3.event.pageY - 100) + "px"
                    })
                    .style("left", function () {
                        return (d3.event.pageX - 100) + "px";
                    })
            })
            .on("mouseout", function (d) {
                d3.select("#tooltip").style("visibility", "hidden")
            });

        function mouseover(d, i) {
            d3.select("#tooltip")
                .style("visibility", "visible")
                .html(groupTip(rdr(d)))
                .style("top", function () {
                    return (d3.event.pageY - 80) + "px"
                })
                .style("left", function () {
                    return (d3.event.pageX - 130) + "px";
                })

            chordPaths.classed("fade", function (p) {
                return p.source.index != i
                    && p.target.index != i;
            });
        }


        function chordTip(d) {
            var p = d3.format(".2%"), q = d3.format(",.3r")
            return "Chord Info:<br/>"
                + p(d.svalue / d.stotal) + " (" + q(d.svalue) + ") of "
                + d.sname + " prefer " + d.tname
                + (d.sname === d.tname ? "" : ("<br/>while...<br/>"
                + p(d.tvalue / d.ttotal) + " (" + q(d.tvalue) + ") of "
                + d.tname + " prefer " + d.sname))
        }

        function groupTip(d) {
            var p = d3.format(".1%"), q = d3.format(",.3r")
            return "Group Info:<br/>"
                + d.gname + " : " + q(d.gvalue) + "<br/>"
                + p(d.gvalue / d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")"
        }

        // Render it to React elements.
        return faux.toReact()
    }
}


export default Chord;

