import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';

const uri = 'fakultet/'

class PrikazIzabranogFakulteta extends Component {

    state = {
        rukovodioci: [],
        hasError: false,
        loading: true,
    }

    componentWillMount() {
        if (this.props.fakultet != null) {
            axios.get(uri + this.props.fakultet.id + '/rukovodioci')
                .then(resp => {
                    if (resp.data.status === 200) {
                        this.setRukovodoci(resp.data.data);
                    } else {
                        this.setState({
                            hasError: true,
                            loading: false,
                        });
                    }
                }).catch(() => {
                    this.setState({
                        hasError: true,
                        loading: false,
                    });
                });
        }
    }

    setRukovodoci = (data) => {
        this.setState({
            rukovodioci: data,
            loading: false,
        });
    }

    getRukovodioci = () => {
        if (this.state.rukovodioci.length === 0) {
            return (
                <div>Факултет нема руководиоца</div>
            );
        }

        return (
            <table className="table table-stripped">

                <thead>
                    <tr>
                        <th>Име</th>
                        <th>Презиме</th>
                        <th>Датум од</th>
                        <th>Датум до</th>
                        <th>Звање</th>
                        <th>Титула</th>
                        <th>Тип руководиоца</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.rukovodioci.map((rukovodilac, i) => {
                        return (
                            <tr key={i + Math.random() + 'i'}>
                                <td>{rukovodilac.ime}</td>
                                <td>{rukovodilac.prezime}</td>
                                <td>{rukovodilac.datumOd}</td>
                                <td>{rukovodilac.datumDo}</td>
                                <td>{rukovodilac.zvanje.naziv}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        );
                    })}

                </tbody>

            </table>
        );
    }

    render() {
        let content = null;

        if (this.state.loading) {
            content = (
                <div className="text-center">
                    Учитавање података је у току...
                    <div>{loadingIcon}</div>
                </div>
            );
        } else if (this.state.hasError) {
            content = 'Дошло је до грешке приликом приказивања података';
        } else {
            content = (
                <div>
                    {this.props.fakultet.naziv}

                    <h4>Руководиоци</h4>
                    {this.getRukovodioci()}
                </div>
            );
        }

        return (
            <React.Fragment>

                {content}

            </React.Fragment>
        );
    }
}

export default PrikazIzabranogFakulteta;