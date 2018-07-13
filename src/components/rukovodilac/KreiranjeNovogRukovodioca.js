import React, { Component } from 'react';
import { loadingIcon } from '../common/loading'
import axios from 'axios';
import { Select, MenuItem, Paper, TextField, Table, TableBody, TableRow, TableCell, TableHead, Button } from '@material-ui/core';
import TooltipButton from '../common/TooltipButton';
import { closeIcon } from '../common/icons';

class KreiranjeNovogRukovodioca extends Component {

    state = {
        ucitaniPodaci: {
            fakulteti: [],
            nastavnici: [],
            tipoviRukovodioca: [],
        },

        selektovaniNastavnik: null,
        selektovaniFakultet: null,
        selektovaniTipRukovodioca: null,

        loading: true,
        hasError: false,
    }


    async componentDidMount() {
        await this.ucitajPodatke('fakultet', 'fakulteti');
        await this.ucitajPodatke('tip-rukovodioca', 'tipoviRukovodioca');
        await this.ucitajPodatke('nastavnik', 'nastavnici');
        this.setKrajUcitavanjaPodataka();
    }

    ucitajPodatke = async (uri, prop) => {
        try {
            if (!this.state.hasError) {

                const resp = await axios.get(uri);

                if (resp.data.status === 200) {
                    const podaci = this.state.ucitaniPodaci;
                    podaci[prop] = resp.data.data;

                    this.setState({
                        ucitaniPodaci: podaci
                    });
                } else {
                    this.setError();
                }
            }
        } catch (error) {
            this.setError();
        }
    }

    setKrajUcitavanjaPodataka = () => {
        this.setState({
            loading: false,
        });
    }

    setError = () => {
        this.setState({
            hasError: true,
            loading: false,
        });
    }

    kreirajRukovodioca = (e) => {
        e.preventDefault();

        alert('TODO :)');
    }

    renderPodatkeONastavniku = () => {
        if (this.state.selektovaniNastavnik == null) {
            return null;
        }

        const nastavnik = { ...this.state.selektovaniNastavnik }

        return (
            <Paper style={{ padding: '20px' }}>
                <h5>{nastavnik.ime} {nastavnik.prezime}</h5>
                <div>
                    {nastavnik.zvanje != null ? nastavnik.zvanje.naziv : ''}
                </div>

                <div>
                    {nastavnik.titula != null ? nastavnik.titula.naziv : ''}
                </div>
            </Paper>
        );
    }

    renderPodatkeOFakultetu = () => {
        if (this.state.selektovaniFakultet == null) {
            return null;
        }

        const fakultet = { ...this.state.selektovaniFakultet }

        let podaciFakulteta = null;
        if (fakultet.podaci.length > 0) {
            podaciFakulteta = (
                <Table fullWidth style={{ marginTop: '10px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Вредност</TableCell>
                            <TableCell>Тип податка</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            fakultet.podaci.map(podatak => {
                                return (
                                    <TableRow key={podatak.id + '-' + fakultet.id} hover>
                                        <TableCell>{podatak.vrednost}</TableCell>
                                        <TableCell>{podatak.tipPodatka.naziv}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            );
        }

        return (
            <Paper style={{ padding: '20px' }}>
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                    <h5>{fakultet.naziv}</h5>

                    <Table fullWidth>
                        <TableBody>
                            <TableRow>
                                <TableCell>Научна област</TableCell>
                                <TableCell>{fakultet.naucnaOblast.naziv}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Матини број</TableCell>
                                <TableCell>{fakultet.maticniBroj}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Порески број</TableCell>
                                <TableCell>{fakultet.poreskiBroj}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>

                    {podaciFakulteta}
                </div>
            </Paper>
        );
    }

    renderContent = () => {
        return (
            <React.Fragment>
                <form onSubmit={this.kreirajRukovodioca} style={{ marginTop: '50px' }}>

                    <Paper style={{ padding: '30px', marginBottom: '20px' }}>
                        <h5>Подаци о руководиоцу</h5>
                        <div className="row">
                            <div className="col-4">
                                <Select
                                    fullWidth
                                    value='NastavnikSelect'
                                    onChange={(e) => {
                                        const nastavnikIndex = this.state.ucitaniPodaci.nastavnici.findIndex(n => n.id === e.target.value);

                                        if (nastavnikIndex >= 0) {
                                            const nastavnik = {
                                                ...this.state.ucitaniPodaci.nastavnici[nastavnikIndex]
                                            }

                                            this.setState({
                                                selektovaniNastavnik: nastavnik,
                                            });
                                        } else {
                                            this.setState({
                                                selektovaniNastavnik: null,
                                            })
                                        }

                                    }}
                                    renderValue={() => {
                                        const selektovaniNastavnik = { ...this.state.selektovaniNastavnik }
                                        if (selektovaniNastavnik != null) {
                                            return selektovaniNastavnik.ime;
                                        }
                                        return '';
                                    }}
                                >

                                    {
                                        this.state.ucitaniPodaci.nastavnici.map(nastavnik => {
                                            return (
                                                <MenuItem
                                                    key={nastavnik.id}
                                                    value={nastavnik.id}>
                                                    {nastavnik.zvanje != null ? nastavnik.zvanje.naziv : ''} {nastavnik.ime} {nastavnik.prezime}
                                                </MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </div>

                            <div className="col-2">
                                {
                                    (this.state.selektovaniNastavnik != null) ?
                                        <TooltipButton
                                            tooltip='Поништи избор наставника'
                                            onClick={() => { this.setState({ selektovaniNastavnik: null }) }}>
                                            {closeIcon}
                                        </TooltipButton> : ''
                                }

                            </div>

                            <div className="col-6">
                                {
                                    this.renderPodatkeONastavniku()
                                }
                            </div>

                        </div>
                    </Paper>




                    <Paper style={{ padding: '30px', marginBottom: '20px' }}>
                        <h5>Подаци о факултету</h5>
                        <div className="row">

                            <div className="col-4">
                                <Select
                                    fullWidth
                                    value='FakultetSelect'
                                    onChange={(e) => {
                                        const fakultetIndex = this.state.ucitaniPodaci.fakulteti.findIndex(f => f.id === e.target.value);

                                        if (fakultetIndex >= 0) {
                                            const fakultet = {
                                                ...this.state.ucitaniPodaci.fakulteti[fakultetIndex]
                                            }

                                            this.setState({
                                                selektovaniFakultet: fakultet,
                                            });
                                        } else {
                                            this.setState({
                                                selektovaniFakultet: null,
                                            });
                                        }
                                    }}
                                    renderValue={() => {
                                        const selektovaniFakultet = { ...this.state.selektovaniFakultet }
                                        if (selektovaniFakultet != null) {
                                            return selektovaniFakultet.naziv;
                                        }
                                        return '';
                                    }}
                                >
                                    {
                                        this.state.ucitaniPodaci.fakulteti.map(fakultet => {
                                            return (
                                                <MenuItem
                                                    key={fakultet.id}
                                                    value={fakultet.id}>
                                                    {fakultet.naziv}
                                                </MenuItem>
                                            );
                                        })
                                    }
                                </Select>

                            </div>

                            <div className="col-2">
                                {
                                    (this.state.selektovaniFakultet != null) ?
                                        <TooltipButton
                                            tooltip='Поништи избор факултета'
                                            onClick={() => { this.setState({ selektovaniFakultet: null }) }}>
                                            {closeIcon}
                                        </TooltipButton>
                                        : ''
                                }


                            </div>

                            <div className="col-6">
                                {
                                    this.renderPodatkeOFakultetu()
                                }
                            </div>

                        </div>
                    </Paper>

                    <Paper style={{ padding: '30px', marginBottom: '20px' }}>
                        <h5>Тип руководиоца</h5>

                        <div className="row">
                            <div className="col-4">
                                <Select
                                    fullWidth
                                    value='TipRukovodioca'
                                    renderValue={() => {
                                        if (this.state.selektovaniTipRukovodioca != null) {
                                            return this.state.selektovaniTipRukovodioca.naziv;
                                        }
                                        return '';
                                    }}
                                    onChange={(e) => {
                                        const tipRukovodiocaIndex = this.state.ucitaniPodaci.tipoviRukovodioca.findIndex(tip => tip.id === e.target.value);

                                        if (tipRukovodiocaIndex >= 0) {
                                            const tipRukovodioca = {
                                                ...this.state.ucitaniPodaci.tipoviRukovodioca[tipRukovodiocaIndex]
                                            }

                                            this.setState({
                                                selektovaniTipRukovodioca: tipRukovodioca
                                            })
                                        } else {
                                            this.setState({
                                                selektovaniTipRukovodioca: null
                                            })
                                        }
                                    }}
                                >
                                    {
                                        this.state.ucitaniPodaci.tipoviRukovodioca.map(tip => {
                                            return (
                                                <MenuItem value={tip.id} key={tip.id}>
                                                    {tip.naziv}
                                                </MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </Paper>


                    <Paper style={{ padding: '30px', marginBottom: '20px' }}>
                        <h5>Остали подаци</h5>

                        <div className="row">
                            <div className="col-4">
                                <div style={{ marginBottom: '20px' }}>
                                    Датум од:
                                <TextField
                                        fullWidth
                                        type='date'
                                    />
                                </div>

                                <div>
                                    Датум до:
                                <TextField
                                        fullWidth
                                        type='date'
                                    />
                                </div>

                            </div>
                        </div>
                    </Paper>


                    <Button variant="contained" type='submit'>
                        Сачувај руководиоца
                    </Button>
                </form>

            </React.Fragment >
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
                    <h5>Дошло је до грешке приликом учитавања потребних података.</h5>
                </div>
            );
        } else {
            content = (
                <div>
                    {this.renderContent()}
                </div>
            );
        }

        return (
            <div>

                <h2 className="text-center">Постављање руководиоца факултета</h2>

                {content}

            </div>
        );
    }
}

export default KreiranjeNovogRukovodioca;