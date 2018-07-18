import React from 'react';
import { connect } from 'react-redux'

const WithAuth = (props) => {
    if (props.admin === null) {
        return (
            <div style={{margin: '50px'}}>
                {props.message}
            </div>
        );
    }

    return props.children;
}

const mapStateToProps = (state) => {
    return {
        admin: state.admin,
    }
}

WithAuth.defaultProps = {
    message: 'Пријавите се да бисте извршили акцију'
}

export default connect(mapStateToProps)(WithAuth);