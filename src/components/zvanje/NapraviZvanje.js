import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Button } from 'primereact/components/button/Button';


class NapraviZvanje extends Component {

    state = {
        naziv: '',
    }

    napraviZvanje = (e) => {
        e.preventDefault();

        console.log(this.state.naziv);

        const zvanje = {
            naziv: this.state.naziv
        }

        this.props.napraviZvanje(zvanje);
        this.setState({ naziv: '' });
    }

    render() {
        return (
            <div className="col-12">
                <h1 className="text-center">Направи ново звање</h1>
                
                <form method="POST" onSubmit={this.napraviZvanje}>

                    <div className="ui-float-label" style={{ marginTop: '20px', width: '100%' }}>
                        <InputText
                            type="text"
                            id="naziv"
                            onChange={(e) => this.setState({ naziv: e.target.value })}
                            value={this.state.naziv}
                            autoComplete="off"
                            className="form-control"
                        />
                        <label htmlFor="naziv">Назив звања</label>
                    </div>

                    <Button label="Направи" type="submit" className="ui-button-success" style={{ marginTop: '10px' }} />
                </form>
            </div>
        );
    }
}

export default NapraviZvanje;