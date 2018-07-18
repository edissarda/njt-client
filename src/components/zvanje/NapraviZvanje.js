import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import WithAuth from '../hoc/WithAuth';

class NapraviZvanje extends Component {

    state = {
        naziv: '',
    }

    napraviZvanje = (e) => {
        e.preventDefault();

        const zvanje = {
            naziv: this.state.naziv.trim()
        }

        this.props.napraviZvanje(zvanje);
        this.setState({ naziv: '' });
    }

    render() {
        return (
            <div className="col-12">
                <WithAuth>
                    <h4 className="text-center">Креирање новог звања</h4>

                    <form method="POST" onSubmit={this.napraviZvanje}>

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

export default NapraviZvanje;