import React from "react";
import PropTypes from "prop-types";
import { forkAndCommit } from "../../github/push";

import "./github.css";

//TODO: new styles, get rid of react-overlays, retransit to PR, show submission result

import { Modal } from "react-overlays";
const modalStyle = {
  position: "fixed",
  zIndex: 1040,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

const backdropStyle = {
  ...modalStyle,
  zIndex: "auto",
  backgroundColor: "#000",
  opacity: 0.5
};

const dialogStyle = function() {
  // we use some psuedo random coords so nested modals
  // don't sit right on top of each other.
  let top = 50;
  let left = 50;

  return {
    position: "absolute",
    width: 400,
    top: top + "%",
    left: left + "%",
    transform: `translate(-${top}%, -${left}%)`,
    border: "1px solid #e5e5e5",
    backgroundColor: "white",
    boxShadow: "0 5px 15px rgba(0,0,0,.5)",
    padding: 20
  };
};

class PullRequestForm extends React.Component {
  static propTypes = {
    isShown: PropTypes.bool.isRequired,
    yamlString: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    onHide: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      title: "",
      commit_msg: "",
      body: "",
      prResult: "",
      pushResult: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.textInput = this.textInput.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { yamlString } = this.props;
    const { username, password, title, body, commit_msg } = this.state;

    const forkResult = forkAndCommit({ username, password }, yamlString, {
      title,
      body,
      commit_msg
    });
    forkResult.prPromise
      .then(() => this.setState({ prResult: "Successful" }))
      .catch(() => this.setState({ prResult: "Failed" }));

    this.setState({
      pushResult: forkResult.commited ? "Successful" : "Failed"
    });
  }

  textInput(name, placeholder) {
    return (
      <input
        placeholder={placeholder}
        name={name}
        type={name === "password" ? "password" : "text"}
        value={this.state[name]}
        onChange={this.handleInputChange}
      />
    );
  }

  render() {
    const { isShown, errors, onHide } = this.props;
    const { prResult, pushResult } = this.state;
    const { textInput } = this;

    const errorsDialog = <div>Please, resolve errors before making a PR. </div>;

    const prDialog = (
      <div className="pull_request_form">
        <h3 id="modal-label">Create Pull Request</h3>
        <form onSubmit={this.handleSubmit}>
          {textInput("username", "username")}
          <br />
          {textInput("password", "password")}
          <br />
          {textInput("commit_msg", "commit message")}
          <br />
          {textInput("title", "PR title")}
          <br />
          {textInput("body", "PR body")}
          <input type="submit" value="Submit" />
        </form>
      </div>
    );

    return (
      <div>
        <Modal
          aria-labelledby="modal-label"
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={isShown}
          onHide={onHide}
        >
          <div style={dialogStyle()}>
            {pushResult && <div>Push result: {pushResult}</div>}
            {prResult && <div>New PR created: {prResult}</div>}
            {!prResult && errors.length ? errorsDialog : prDialog}
          </div>
        </Modal>
      </div>
    );
  }
}

export default PullRequestForm;
