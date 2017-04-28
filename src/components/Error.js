import React, { Component } from 'react';
import PropTypes from 'prop-types'

import './error.css'

class Error extends Component {

    static propTypes = {
        line: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        scope: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    }

    handleClick = () => {
        this.props.onClick(this.props.line)
    }

    render() {
        const {line, message, scope} = this.props

        return (
            <div className="error">
                Error. <span className="anchor_hack" onClick={this.handleClick}>Line {line}</span>: {message}
            </div>
        )
    }
}


export default Error;