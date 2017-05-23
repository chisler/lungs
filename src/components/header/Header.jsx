import React from "react";
import logo from "../../logo.svg";

import "./header.css";

const Header = props => {
  const { reset, onClickSendPR } = props;

  return (
    <div className="nav-main">
      <div className="wrap">
        <a className="nav-home" href="/">
          <img className="nav-logo" alt="Lungs" src={logo} width="36" height="36" />
          Lungs
        </a>
        <div className="nav-lists">
          <ul className="nav-site nav-site-internal">
            <li><a href="https://github.com/chisler/lungs">Guide</a></li>
            <li><a href="#" onClick={reset}>Reset</a></li>
            <li>
              <a href="#" onClick={onClickSendPR}>
                Send Pull Request
              </a>
            </li>
          </ul>
          <ul className="nav-site nav-site-external">
            <li><a href="https://github.com/chisler/lungs">GitHub</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;