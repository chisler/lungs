import React, { Component } from 'react';
import PropTypes from 'prop-types'

import './error.css'

//TODO: get rid of unused state agruments

class Error extends Component {

    static propTypes = {
        line: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        scope: PropTypes.string.isRequired
    }

    render() {
        const {line, message, scope} = this.props

        return (
            <div className="error">
                Error. Line {line}: {message}
            </div>
        )
    }
}


export default Error;