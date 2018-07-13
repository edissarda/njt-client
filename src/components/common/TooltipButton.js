import React, { Component } from 'react';
import { Tooltip, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

class TooltipButton extends Component {

    handleClick = () => {
        this.props.onClick();
    }

    render() {
        return (
            <Tooltip title={this.props.tooltip}>
                <Button mini={this.props.mini} onClick={this.handleClick} variant={this.props.variant}>
                    {this.props.children}
                </Button>
            </Tooltip>
        );
    }
}

TooltipButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    tooltip: PropTypes.string,
    mini: PropTypes.bool,
}

TooltipButton.defaultProps = {
    variant: 'text',
    tooltip: '',
    mini: false,
}

export default TooltipButton;