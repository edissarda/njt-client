import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import PropTypes from 'prop-types';
import { Growl } from '../../../node_modules/primereact/components/growl/Growl';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import { createIcon } from '../common/icons';

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

        const common = (
            <div>
                <h4>Руководиоци</h4>
                <p>
                    <Button variant="text">
                        {createIcon}
                    </Button>
                </p>
            </div>
        );
        if (this.state.rukovodioci.length === 0) {
            return (
                <div>
                    <Paper style={{ marginBottom: '20px', marginTop: '20px', padding: '20px' }}>
                        {common}
                        Факултет нема руководиоца.
                    </Paper>
                </div>
            );
        }

        return (
            <div>
                <Paper style={{ marginBottom: '20px', marginTop: '20px', padding: '20px' }}>
                    { common }
                    < Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Име</TableCell>
                            <TableCell>Презиме</TableCell>
                            <TableCell>Датум од</TableCell>
                            <TableCell>Датум до</TableCell>
                            <TableCell>Звање</TableCell>
                            <TableCell>Титула</TableCell>
                            <TableCell>Тип руководиоца</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {this.state.rukovodioci.map(rukovodilac => {
                            return (
                                <TableRow key={'tr-key-' + rukovodilac.id} hover={true}>
                                    <TableCell>{rukovodilac.ime}</TableCell>
                                    <TableCell>{rukovodilac.prezime}</TableCell>
                                    <TableCell>{rukovodilac.datumOd}</TableCell>
                                    <TableCell>{rukovodilac.datumDo}</TableCell>
                                    <TableCell>{rukovodilac.hasOwnProperty('zvanje') ? rukovodilac.zvanje.naziv : 'НЕПОЗНАТО'}</TableCell>
                                    <TableCell>{(rukovodilac.hasOwnProperty('titula')) ? rukovodilac.titula.naziv : 'НЕПОТНАТО'}</TableCell>
                                    <TableCell>{(rukovodilac.hasOwnProperty('tipRukovodioca')) ? rukovodilac.tipRukovodioca.naziv : 'НЕПОЗНАТО'}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </Paper>
            </div >
        );
    }

    getPodaciOFakultetu = () => {
        const common = (<h5>Подаци о факултету</h5>);

        if (this.state.fakultet.podaci.length === 0) {
            return (
                <div>
                    <Paper style={{ marginBottom: '20px', marginTop: '20px', padding: '20px' }}>
                        {common}
                        Тренутно нема додатних података о факултету.
                    </Paper>
                </div>
            );
        }
        return (
            <div>
                <Paper style={{ marginBottom: '20px', padding: '20px' }}>
                    {common}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Вредност</TableCell>
                                <TableCell>Тип</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {this.state.fakultet.podaci.map(podatak => {
                                return (
                                    <TableRow key={'tr-key-' + podatak.id} hover={true}>
                                        <TableCell>{podatak.vrednost}</TableCell>
                                        <TableCell>{podatak.tipPodatka.naziv}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
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
                    <Paper style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Матични број:</TableCell>
                                    <TableCell>{this.state.fakultet.maticniBroj}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Порески број:</TableCell>
                                    <TableCell>{this.state.fakultet.poreskiBroj}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Опис:</TableCell>
                                    <TableCell>
                                        <div style={{ wordWrap: 'break-word', maxWidth: '600px' }}>
                                            {this.state.fakultet.opis}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Врста организације:</TableCell>
                                    <TableCell>{this.state.fakultet.vrstaOrganizacije.naziv}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Научна област:</TableCell>
                                    <TableCell>{this.state.fakultet.naucnaOblast.naziv}</TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </Paper>


                    {
                        this.getPodaciOFakultetu()
                    }



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