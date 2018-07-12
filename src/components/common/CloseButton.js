import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { closeIcon } from './../common/icons';

class CloseButton extends Component {
    render() {
        return (
            <Button
                style={{ position: 'absolute', right: '20px', top: '20px'}}
                variant="fab"
                onClick={this.props.onClick}
                mini={true}
            >
                {closeIcon}
            </Button>
        );
    }
}

CloseButton.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default CloseButton;