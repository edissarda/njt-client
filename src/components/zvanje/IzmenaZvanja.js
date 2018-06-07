import React, { Component } from 'react';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';

class IzmenaZvanja extends Component {

    handleSubmit = (e) => {
        e.preventDefault();

        const zvanje = {
            zvanjeId: this.props.zvanje.zvanjeId,
            naziv: e.target.naziv.value.trim()
        }

        this.props.azurirajZvanje(zvanje);
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="text-center">Измена звања</h2>

                <form onSubmit={this.handleSubmit} style={{ marginTop: '30px' }}>

                    <div className="form-group">
                        <InputText
                            autoComplete="off"
                            value={(this.props.zvanje === null) ? '' : this.props.zvanje.zvanjeId}
                            readOnly={true}
                            type="text"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <div className="ui-float-label">
                            <InputText
                                id="naziv"
                                autoComplete="off"
                                value={(this.props.zvanje === null) ? '' : this.props.zvanje.naziv}
                                onChange={this.props.onNazivZvanjaChange}
                                type="text"
                                className="form-control"
                            />
                            <label htmlFor="naziv">Назив звања</label>
                        </div>
                    </div>

                    <Button type="submit" label="Измени" style={{ marginTop: '10px' }} />
                </form>
            </React.Fragment>
        );
    }
}

export default IzmenaZvanja;