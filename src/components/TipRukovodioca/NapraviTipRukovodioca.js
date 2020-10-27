import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import WithAuth from '../hoc/WithAuth';

class napraviTipRukovodioca extends Component {

    state = {
        naziv: '',
    }

    napraviTipRukovodioca = (e) => {
        e.preventDefault();

        const tipRukovodioca = {
            naziv: this.state.naziv.trim()
        }

        this.props.napraviTipRukovodioca(tipRukovodioca);
        this.setState({ naziv: '' });
    }

    render() {
        return (
            <div className="col-12">
                <h4 className="text-center">Креирање новог типа руководиоца</h4>

                <WithAuth>
                    <form method="POST" onSubmit={this.napraviTipRukovodioca}>

                        <TextField
                            type="text"
                            label="Назив"
                            onChange={(e) => this.setState({ naziv: e.target.value })}
                            value={this.state.naziv}
                            autoComplete="off"
                            fullWidth
                        />

                        <Button type='submit' variant="contained" fullWidth style={{ marginTop: '20px' }}>
                            Сачувај
                    </Button>
                    </form>
                </WithAuth>
            </div>
        );
    }
}

export default napraviTipRukovodioca;