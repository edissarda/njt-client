import React, { Component } from 'react';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Dialog } from '@material-ui/core'
import axios from 'axios'
import PropTypes from 'prop-types'
import { loadingIcon } from '../common/loading';
import { createIcon } from '../common/icons';
import TooltipButton from './../common/TooltipButton'
import DodajZvanjeNastavniku from './DodajZvanjeNastavniku'
import CloseButton from './../common/CloseButton'
import DodajTituluNastavniku from './DodajTituluNastavniku';

const uri = 'nastavnik/';

class PrikazIzabranogNastavnika extends Component {

    state = {
        nastavnik: null,
        loading: true,
        hasError: false,

        prikaziDijalogDodajZvanje: false,
        prikaziDijalogDodajTitulu: false,
    }

    componentDidMount() {
        this.ucitajNastavnika();
    }

    ucitajNastavnika = () => {
        axios.get(uri + this.props.id)
            .then(resp => {
                if (resp.data.status === 200) {
                    this.setNastavnik(resp.data.data);
                } else {
                    this.setError();
                }
            })
            .catch(() => {
                this.setError();
            });
    }

    setNastavnik = (nastavnik) => {
        this.setState({
            nastavnik,
            loading: false,
            hasError: false,
        });
    }

    setError = () => {
        this.setState({
            loading: false,
            hasError: true,
        })
    }

    renderZvanjaNastavnika = () => {
        const header = (
            <h5>Звања</h5>
        );

        if (this.state.nastavnik === null || this.state.nastavnik.zvanja.length === 0) {
            return (
                <div>
                    {header}
                    Наставник тренутно нема ниједно звање.
                </div>
            );
        }

        return (
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                {header}

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Звање</TableCell>
                            <TableCell>Датум од</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            this.state.nastavnik.zvanja.map(zvanje => {
                                return (
                                    <TableRow key={zvanje.id + "-" + Math.random()}>
                                        <TableCell>{zvanje.naziv}</TableCell>
                                        <TableCell>{zvanje.datumOd}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    renderTutuleNastavnika = () => {
        const header = <h5>Титуле</h5>;

        if (this.state.nastavnik === null || this.state.nastavnik.titule.length === 0) {
            return (
                <div>
                    {header}
                    Наставник тренутно нема ниједну титулу.
                </div>
            );
        }

        return (
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                {header}

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Титула</TableCell>
                            <TableCell>Датум од</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            this.state.nastavnik.titule.map(titula => {
                                return (
                                    <TableRow key={titula.id + "-" + Math.random()}>
                                        <TableCell>{titula.naziv}</TableCell>
                                        <TableCell>{titula.datumOd}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    renderDijalogDodajZvanje = () => {
        if (this.state.nastavnik === null) {
            return null;
        }

        return (
            <Dialog
                open={this.state.prikaziDijalogDodajZvanje}
                onClose={() => {
                    this.setState({
                        prikaziDijalogDodajZvanje: false,
                    })
                }}
                maxWidth={false}
                fullWidth
            >
                <div style={{ padding: '30px' }}>
                    <DodajZvanjeNastavniku nastavnikId={this.state.nastavnik.id} />
                </div>

                <CloseButton onClick={() => {
                    this.setState({
                        prikaziDijalogDodajZvanje: false,
                    })
                }} />

            </Dialog>
        );
    }

    renderDijalogDodajTitulu = () => {
        if (this.state.nastavnik === null) {
            return null;
        }

        return (
            <Dialog
                open={this.state.prikaziDijalogDodajTitulu}
                onClose={() => {
                    this.setState({
                        prikaziDijalogDodajTitulu: false,
                    })
                }}
                maxWidth={false}
                fullWidth
            >
                <div style={{ padding: '30px' }}>
                    <DodajTituluNastavniku nastavnikId={this.state.nastavnik.id} />
                </div>

                <CloseButton onClick={() => {
                    this.setState({
                        prikaziDijalogDodajTitulu: false,
                    })
                }} />

            </Dialog>
        );
    }

    render() {

        let content = null;

        if (this.state.loading) {
            content = (
                <div className="text-center">
                    {loadingIcon}
                </div>
            );
        } else if (this.state.hasError) {
            content = (
                <div className="text-center">
                    <h5>Дошло је до грешке приликом учитавања наставника</h5>
                </div>
            );
        } else {
            content = (
                <React.Fragment>
                    <h3 className="text-center" style={{ marginBottom: '20px' }}>
                        {this.state.nastavnik.ime} {this.state.nastavnik.prezime} ({this.state.nastavnik.brojRadneKnjizice})
                    </h3>

                    <div className="text-center">
                        <div className="row">

                            <div className="col-6">
                                <TooltipButton
                                    tooltip="Додај звање наставнику"
                                    onClick={() => {
                                        this.setState({
                                            prikaziDijalogDodajZvanje: true,
                                        })
                                    }}
                                >
                                    {createIcon}
                                </TooltipButton>
                                {
                                    this.renderZvanjaNastavnika()
                                }

                                {
                                    this.renderDijalogDodajZvanje()
                                }
                            </div>


                            <div className="col-6">
                                <TooltipButton
                                    tooltip="Додај титулу наставнику"
                                    onClick={() => {
                                        this.setState({
                                            prikaziDijalogDodajTitulu: true,
                                        })
                                    }}>
                                    {createIcon}
                                </TooltipButton>
                                {
                                    this.renderTutuleNastavnika()
                                }

                                {
                                    this.renderDijalogDodajTitulu()
                                }
                            </div>

                        </div>


                    </div>
                </React.Fragment>
            );
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

PrikazIzabranogNastavnika.propTypes = {
    id: PropTypes.number
}

PrikazIzabranogNastavnika.defaultProps = {
    id: 0,
}

export default PrikazIzabranogNastavnika;