import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { TextField } from '../../../node_modules/@material-ui/core';

class IzmenaZvanja extends Component {

    handleSubmit = (e) => {
        e.preventDefault();

        const zvanje = {
            id: this.props.zvanje.id,
            naziv: e.target.naziv.value.trim()
        }

        this.props.azurirajZvanje(zvanje);
    }

    render() {
        return (
            <React.Fragment>
                <h4 className="text-center">Измена звања</h4>

                <form onSubmit={this.handleSubmit} style={{ marginTop: '30px' }}>

                    <TextField
                        autoComplete="off"
                        value={(this.props.zvanje === null) ? '' : this.props.zvanje.id}
                        readOnly
                        type="text"
                        fullWidth
                        label="ИД"
                    />

                    <TextField
                        id="naziv"
                        autoComplete="off"
                        value={(this.props.zvanje === null) ? '' : this.props.zvanje.naziv}
                        onChange={this.props.onNazivZvanjaChange}
                        type="text"
                        label="Назив"
                        fullWidth
                    />

                    <Button type="submit" variant="contained" fullWidth style={{ marginTop: '10px' }}>
                        Сачувај измене
                    </Button>
                </form>
            </React.Fragment>
        );
    }
}

export default IzmenaZvanja;