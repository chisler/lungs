import React, { Component } from 'react';
import PropTypes from 'prop-types'

import Error from './Error'

import './error.css'
//TODO: get rid of unused state agruments

class Errors extends Component {

    static propTypes = {
        errors: PropTypes.array.isRequired,
    }

    render() {
        const {errors} = this.props

        return (
            <div className="errors_container">
                {errors.map(err => {
                    return (
                        <Error
                            line={err.line + 1}
                            message={err.message}
                            scope={err.scope}
                        />
                    )
                })}
            </div>
        )
    }
}


export default Errors;