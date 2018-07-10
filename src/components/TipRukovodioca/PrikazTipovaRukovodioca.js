import React, { Component } from 'react';
import axios from 'axios';
import GenerickiPrikaz from './../common/GenerickiPrikaz';
import { loadingIcon } from './../common/loading';

axios.defaults.baseURL = 'http://localhost:8080/';

const uri = 'tip-rukovodioca';

class PrikazTipovaRukovodioca extends Component {
    state = {
        tipoviRukovodioca: [],
        loading: true,
        hasError: false,
        title: 'Типови руководиоца',
    }

    componentDidMount() {
        this.ucitajTipoveRukovodioca();
    }

    ucitajTipoveRukovodioca = () => {
        axios.get(uri)
            .then(resp => {
                const response = resp.data;
                if (response.status === 200) {
                    this.setSuccessLoading(response.data);
                } else {
                    this.setErrorLoading();
                }
            }).catch(() => {
                this.setErrorLoading();
            })
    }

    setErrorLoading = () => {
        this.setState({
            hasError: true,
            loading: false,
        });
    }

    setSuccessLoading = (data) => {
        this.setState({
            tipoviRukovodioca: data,
            loading: false,
            hasError: false,
        });
    }

    render() {
        let content = (<h1 className="text-center">{this.state.title}</h1>);

        if (this.state.loading) {
            content = (
                <div className="text-center">
                    <h2>{this.state.title}</h2>
                    {loadingIcon}
                </div>
            );
        } else if (this.state.hasError) {
            content = (
                <div className="text-center">
                    <h2>{this.state.title}</h2>
                    <h4>Грешка приликом учитавања типова руководиоца</h4>
                </div>
            );
        } else {
            content = (
                <GenerickiPrikaz
                    title={this.state.title}
                    data={this.state.tipoviRukovodioca}
                    columnNames={['id', 'naziv']}
                />
            );
        }

        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default PrikazTipovaRukovodioca;