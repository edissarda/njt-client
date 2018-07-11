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
                <Button onClick={this.handleClick}>
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
}

TooltipButton.defaultProps = {
    variant: 'text',
    tooltip: '',
}

export default TooltipButton;