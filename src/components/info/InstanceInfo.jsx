import React, { Component } from "react";
import PropTypes from "prop-types";
import InfoWidget from "./InfoWidget";

import "./info_widget.css";
import {
  getIsContainerKey,
  isNestedInfoWidget,
  makeBasePretty,
  makeKeyPretty,
  isArrayNode
} from "./helpers";

class InstanceInfo extends Component {
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

    const base = isContainerKey ? null : makeBasePretty(data.base);
    const nestedNodeClass = isContainerKey ? null : "nested_info_widget";

    const body = (
      <div>
        {" "}{Object.keys(data.value).map(key => {
          const node = data.value[key];
          const prettyKey = makeKeyPretty(key);
          if (!isNestedInfoWidget(node)) {
            if (isArrayNode(node)) {
              return (
                <div key={key}>
                  <div className="info_widget__key">{prettyKey}</div>
                  <div className="info_widget__value">
                    <ul className="info_widget_list">
                      {node.value.map((item, i) => (
                        <li key={i}>{item.value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            let value = typeof node === "object" ? node.value : node;
            value = value.toString() || "No info yet."
            
            return (
              <div key={key}>
                <div className="info_widget__key">{prettyKey}</div>
                <span className="info_widget__value">{value}</span>
              </div>
            );
          }
          const nestedNodes = (
            <div className={nestedNodeClass}>
              <InstanceInfo
                data={node}
                isContainerKey={getIsContainerKey(node, key)}
              />
            </div>
          );
          const collapsed = this.state.collapsed[key];

          return (
            <div key={key}>
              <div
                onClick={() => this.handleClick(key)}
                className="info_widget__key info_widget__toggable_key"
              >
                <span>
                  {collapsed ? "[+]  " : " [-]  "}
                </span>
                {prettyKey}
              </div>
              {collapsed ? null : nestedNodes}
            </div>
          );
        })}
      </div>
    );

    return <InfoWidget base={base} body={body} />;
  }
}

export default InstanceInfo;
