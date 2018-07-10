import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import PropTypes from 'prop-types';
import { Button } from '../../../node_modules/primereact/components/button/Button';
import { Growl } from '../../../node_modules/primereact/components/growl/Growl';

const uri = 'fakultet/'

class PrikazIzabranogFakulteta extends Component {

    state = {
        rukovodioci: [],
        fakultet: null,
        hasError: false,
        loading: true,
    }

    async componentWillMount() {
        console.log(this.props.id);

        await axios.get(uri + this.props.id)
            .then(resp => {
                if (resp.data.status === 200) {
                    this.setFakultet(resp.data.data);
                } else {
                    this.setHasError();
                }
            })
            .catch(() => {
                this.setHasError();
            });

        await axios.get(uri + this.props.id + '/rukovodioci')
            .then(resp => {
                if (resp.data.status === 200) {
                    this.setRukovodoci(resp.data.data);
                } else {
                    this.setHasError();
                }
            }).catch(() => {
                this.setHasError();
            });

        const error = this.state.hasError;

        this.setState({
            loading: false,
            hasError: error || false,
        });
    }

    setFakultet = (data) => {
        this.setState({
            fakultet: data,
        });
    }

    setHasError = () => {
        this.setState({
            hasError: true,
        });
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
                                <td>{rukovodilac.hasOwnProperty('zvanje') ? rukovodilac.zvanje.naziv : 'НЕПОЗНАТО'}</td>
                                <td>{(rukovodilac.hasOwnProperty('titula')) ? rukovodilac.titula.naziv : 'НЕПОТНАТО'}</td>
                                <td>{(rukovodilac.hasOwnProperty('tipRukovodioca')) ? rukovodilac.tipRukovodioca.naziv : 'НЕПОЗНАТО'}</td>
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
                    <h3 className="text-center">{this.state.fakultet.naziv}</h3>
                    <table className="table table-stripped table-responsive">
                        <tbody>
                            <tr>
                                <td>Матични број:</td>
                                <td>{this.state.fakultet.maticniBroj}</td>
                            </tr>
                            <tr>
                                <td>Порески број:</td>
                                <td>{this.state.fakultet.poreskiBroj}</td>
                            </tr>

                            <tr>
                                <td>Опис:</td>
                                <td>
                                    <div style={{ wordWrap: 'break-word', maxWidth: '600px' }}>
                                        {this.state.fakultet.opis}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>Врста организације:</td>
                                <td>{this.state.fakultet.vrstaOrganizacije.naziv}</td>
                            </tr>
                            <tr>
                                <td>Научна област:</td>
                                <td>{this.state.fakultet.naucnaOblast.naziv}</td>
                            </tr>
                        </tbody>

                    </table>

                    <h4>Руководиоци</h4>

                    <p><Button label="Додај руководиоца" /></p>

                    {this.getRukovodioci()}
                </div>
            );
        }

        return (
            <div>

                <Growl ref={(el) => this.growl = el}></Growl>

                {content}

            </div>
        );
    }
}

PrikazIzabranogFakulteta.propTypes = {
    id: PropTypes.number,
}

PrikazIzabranogFakulteta.defaultProps = {
    id: 0,
}

export default PrikazIzabranogFakulteta;