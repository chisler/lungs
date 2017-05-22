import React, { Component } from "react";
import PropTypes from "prop-types";

import "./info_widget.css";

//Accepts map
//Map = children, else = its properties

class InfoWidget extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    isContainerKey: PropTypes.bool
  };

  constructor(props) {
    super(props);

    let collapsed = {};
    const keys = Object.keys(props.data ? props.data.value : []);
    for (let i in keys) {
      collapsed[keys[i]] = true;
    }
    this.state = {
      collapsed
    };
  }

  toggleCollapsedKey = key => {
    this.setState((prevState, props) => {
      let collapsed = Object.assign({}, prevState.collapsed);
      collapsed[key] = !prevState.collapsed[key];

      return {
        collapsed
      };
    });
  };

  handleClick = key => {
    this.toggleCollapsedKey(key);
  };

  render() {
    const { data, isContainerKey } = this.props;

    if (!data) {
      return <div />;
    }
    //TODO: move out of render()
    const isNestedInfoWidget = node =>
      typeof node.value === "object" && !(node.value instanceof Array);

    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

    const makeKeyPretty = key => key.split("_").map(capitalize).join(" ");

    const makeBasePretty = base =>
      capitalize(base.split("/")[base.split("/").length - 1] || base);

    const getIsContainerKey = (data, key) =>
      makeBasePretty(data.base) === makeKeyPretty(key);

    return (
      <div className="info_widget">
        <div className="info_widget__header">
          {isContainerKey ? null : makeBasePretty(data.base)}
        </div>
        <div className="info_widget__highlight">
          {Object.keys(data.value).map(key => {
            const node = data.value[key];
            const prettyKey = makeKeyPretty(key);

            if (!isNestedInfoWidget(node)) {
              return (
                <div key={key}>
                  <b>{prettyKey}</b>
                  <p>{node.value}</p>
                </div>
              );
            }
            const nestedNodes = (
              <div className="nested_info_widget">
                <InfoWidget
                  data={node}
                  isContainerKey={getIsContainerKey(node, key)}/>
              </div>
            );
            const collapsed = this.state.collapsed[key];

            return (
              <div key={key}>
                <div
                  onClick={() => this.handleClick(key)}
                  className="info_widget__key"
                >
                  {prettyKey}
                  <span>
                    {collapsed ? " [+]" : " [-]"}
                  </span>
                </div>
                {collapsed ? null : nestedNodes}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default InfoWidget;
