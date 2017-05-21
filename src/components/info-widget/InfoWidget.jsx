import React, { Component } from "react";
import "./info_widget.css";

//Accepts map
//Map = children, else = its properties

class InfoWidget extends Component {
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
    const { data } = this.props;

    if (!data) {
      return <div></div>
    }

    const isNestedInfoWidget = node =>
      typeof node.value === "object" && !(node.value instanceof Array);

    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

    const makeKeyPretty = key => key.split("_").map(capitalize).join(" ");

    const makeBasePretty = base =>
      capitalize(base.split("/")[base.split("/").length - 1] || base);

    return (
      <div>
        <div className="info_widget__header">
          {makeBasePretty(data.base)}
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
            const nestedNodes = <InfoWidget data={node} />;
            const collapsed = this.state.collapsed[key];

            return (
              <div key={key}>
                <div
                  onClick={() => this.handleClick(key)}
                  className="info_widget__key"
                >
                  {prettyKey}
                  <span>
                    {collapsed ? " +" : " -"}
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
