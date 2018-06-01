import React, { Component } from 'react';
import {Button} from 'primereact/components/button/Button';

class Zvanje extends Component {

    state = {
        edit: false,
        newValue: this.props.zvanje.naziv,
    }

    obrisiZvanje = () => {
        this.props.obrisiZvanje(this.props.zvanje.zvanjeId);
    }

    izmeniZvanje = () => {
        this.setState({ edit: !this.state.edit, newValue: this.props.zvanje.naziv });
    }

    azurirajZvanje = () => {
        const zvanje = {
            zvanjeId: this.props.zvanje.zvanjeId,
            naziv: this.state.newValue,
        }

        if (zvanje.naziv.trim() === this.props.zvanje.naziv) {
            this.ponistiIzmene();
            return;
        }

        if (this.props.azurirajZvanje(zvanje)) {
            this.setState({
                edit: false,
                newValue: zvanje.naziv,
            });
        } else {
            this.ponistiIzmene();
        }

    }

    ponistiIzmene = () => {
        const oldValue = this.props.zvanje.naziv;

        this.setState({
            edit: false,
            newValue: oldValue
        });
    }

    setZvanjeName = (e) => {
        this.setState({
            newValue: e.target.value
        });
    }

    render() {

        let contentForName = this.props.zvanje.naziv;
        if (this.state.edit) {
            contentForName = (
                <form onSubmit={this.azurirajZvanje}>
                    <input type="text" className="form-control" value={this.state.newValue} onChange={this.setZvanjeName} />
                    <Button type="submit" onClick={this.azurirajZvanje} className="ui-button-success" label="Потврди" />
                    <Button type="reset" onClick={this.ponistiIzmene} className="ui-button-danger" label="Поништи" />
                </form>
            );
        }

        return (
            <tr>
                <td>{this.props.zvanje.zvanjeId}</td>
                <td style={{ width: '60%' }}>{contentForName}</td>
                <td>
                    <Button onClick={this.izmeniZvanje} label="Измени" className="ui-button-warning" />
                    &nbsp;
                    <Button label="Обриши" className="ui-button-danger" onClick={this.obrisiZvanje} />
                </td>
            </tr>
        );
    }
}

export default Zvanje;