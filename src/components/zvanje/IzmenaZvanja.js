import React, { Component } from 'react';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';

class IzmenaZvanja extends Component {

    handleSubmit = (e) => {
        e.preventDefault();

        const zvanje = {
            zvanjeId: this.props.zvanje.zvanjeId,
            naziv: e.target.naziv.value
        }

        console.log(zvanje);

        // this.props.handleSubmit(zvanje);
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="text-center page-header">Измена звања</h2>

                <form onSubmit={this.handleSubmit} style={{ marginTop: '30px' }}>
                    <div className="ui-float-label">
                        <InputText
                            id="naziv"
                            autoComplete="off"
                            onChange={(e) => {this.setState({noviNaziv: e.target.value})}}
                            type="text"
                            className="form-control"
                        />
                        <label htmlFor="naziv">Назив звања</label>
                    </div>

                    <Button type="submit" label="Измени" style={{ marginTop: '10px' }} />
                </form>
            </React.Fragment>
        );
    }
}

export default IzmenaZvanja;