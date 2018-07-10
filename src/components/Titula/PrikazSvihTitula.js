import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import GenerickiPrikaz from '../common/GenerickiPrikaz';

const uri = 'titula/';

class PrikazSvihTitula extends Component {
    state = {
        titule: [],
        loading: true,
        hasError: false,
    }

    componentDidMount() {
        axios.get(uri).then(resp => {
            if (resp.data.status === 200) {
                this.setState({
                    titule: resp.data.data,
                    loading: false,
                });
            } else {
                this.setError();
            }
        })
            .catch(() => {
                this.setError();
            });
    }

    setError = () => {
        this.setState({
            loading: false,
            hasError: true,
        });
    }

    getLoadingContent = () => {
        return (
            <div className="text-center">
                <h2>Титуле</h2>
                {loadingIcon}
            </div>
        );
    }

    getErrorContent = () => {
        return (
            <div className="text-center">
                <h2>Титуле</h2>
                <h4>Дошло је до грешке приликом учитавања титула</h4>
            </div>
        );
    }

    render() {
        let content = null;

        if (this.state.loading) {
            content = this.getLoadingContent();
        } else if (this.state.hasError) {
            content = this.getErrorContent();
        } else {
            content = (
                <GenerickiPrikaz
                    title='Титуле'
                    data={this.state.titule}
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

export default PrikazSvihTitula;