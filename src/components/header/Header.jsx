import React from "react";
import logo from "../../logo.svg";

import { isEditorMode } from "../../reducers/constants";

import "./header.css";

const Links = props => {
  const { links, action } = props;

  return (
    <div className="nav-lists">
      <ul className="nav-site nav-site-internal">
        {links.map((link, i) => <li key={i}>{link}</li>)}
      </ul>
      <ul className="nav-site nav-site-external">
        <li>
          {action}
        </li>
      </ul>
    </div>
  );
};

const Header = props => {
  const {
    mode,
    onClickSendPR,
    setDisplayMode,
    setEditorMode,

    reset,
    fetchYaml
  } = props;

  const resetAndFetch = () => {
    reset();
    fetchYaml();
  };

  const displayLinks = {
    links: [
      <a href="https://github.com/chisler/lungs">GitHub</a>,
      <a href="https://github.com/chisler/lungs">About</a>
    ],
    action: (
      <a href="#" onClick={setEditorMode}>
        Add info
      </a>
    )
  };

  const editorLinks = {
    links: [
      <a href="https://github.com/chisler/lungs">GitHub</a>,
      <a href="#" onClick={resetAndFetch}>Reset</a>,
      <a href="#" onClick={onClickSendPR}>
        Create Pull Request
      </a>
    ],
    action: (
      <a href="#" onClick={setDisplayMode}>
        See as user
      </a>
    )
  };

  const headerLinks = isEditorMode(mode) ? editorLinks : displayLinks;

  return (
    <div className="nav-main">
      <div className="wrap">
        <a className="nav-home" href="/">
          <img
            className="nav-logo"
            alt="Lungs"
            src={logo}
            width="36"
            height="36"
          />
          Lungs
        </a>
        <Links links={headerLinks.links} action={headerLinks.action} />
      </div>
    </div>
  );
};

export default Header;
