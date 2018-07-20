import React, { Component } from 'react';
import { loadingIcon } from '../common/loading'
import axios from 'axios';
import { Select, MenuItem, Paper, TextField, Table, TableBody, TableRow, TableCell, TableHead, Button, FormHelperText } from '@material-ui/core';
import TooltipButton from '../common/TooltipButton';
import { closeIcon } from '../common/icons';
import { Growl } from 'primereact/components/growl/Growl';
import WithAuth from '../hoc/WithAuth';

class KreiranjeNovogRukovodioca extends Component {

    state = {
        ucitaniPodaci: {
            fakulteti: [],
            nastavnici: [],
            tipoviRukovodioca: [],
        },

        selektovaniNastavnik: null,
        selektovaniFakultet: this.props.fakultet,
        selektovaniTipRukovodioca: null,

        filterNastavnici: '',
        filterFakulteti: '',

        loading: true,
        hasError: false,
    }


    async componentDidMount() {
        this.ucitajPodatke('fakultet', 'fakulteti');
        this.ucitajPodatke('tip-rukovodioca', 'tipoviRukovodioca');
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

        const fakultet = {
            ...this.state.selektovaniFakultet
        }

        const nastavnik = {
            ...this.state.selektovaniNastavnik
        }

        const tipRukovodioca = {
            ...this.state.selektovaniTipRukovodioca
        }

        const rukovodilac = {
            datumOd: e.target.datumOd.value,
            datumDo: e.target.datumDo.value,
            fakultet,
            nastavnik,
            tipRukovodioca,
        }

        this.sacuvajRukovodioca(rukovodilac);
    }

    sacuvajRukovodioca = (rukovodilac) => {
        axios.post('rukovodilac', rukovodilac)
            .then((resp) => {
                if (resp.data.status === 200) {
                    this.showMessage('Руководилац је успешно постављен');
                } else {
                    this.showMessage(resp.data.message, 'error');
                }
            }).catch(err => {
                this.showMessage('Дошло је до грешке. Руководилац није постављен. ' + err, 'error');
            });

    }

    showMessage = (msg, severity = 'success', detail = null) => {
        this.growl.show({ severity: severity, summary: msg, detail: detail, life: 8000 });
    }

    renderPodatkeONastavniku = () => {
        if (this.state.selektovaniNastavnik == null) {
            return null;
        }

        const nastavnik = { ...this.state.selektovaniNastavnik }

        let tabelaZvanja = null;
        let zvanje = null;
        if (nastavnik.zvanja.length > 0) {
            zvanje = nastavnik.zvanja[0].naziv;
            tabelaZvanja = (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Звање</TableCell>
                            <TableCell>Датум од</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            nastavnik.zvanja.map((zvanje, index) => {
                                let selected = false;
                                if (index === 0) {
                                    selected = true;
                                }
                                return (
                                    <TableRow key={nastavnik.id + '-' + zvanje.id} selected={selected}>
                                        <TableCell>{zvanje.naziv}</TableCell>
                                        <TableCell>{zvanje.datumOd}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            );
        }

        let tabelaTitula = null;
        let titula = null;
        if (nastavnik.titule.length > 0) {
            titula = nastavnik.titule[0].naziv;
            tabelaTitula = (
                <Table style={{ marginTop: '20px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Титула</TableCell>
                            <TableCell>Датум од</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            nastavnik.titule.map((titula, index) => {
                                let selected = false;
                                if (index === 0) {
                                    selected = true;
                                }
                                return (
                                    <TableRow key={nastavnik.id + '-' + titula.id} selected={selected}>
                                        <TableCell>{titula.naziv}</TableCell>
                                        <TableCell>{titula.datumOd}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            );
        }

        return (
            <Paper style={{ padding: '20px' }}>
                <div style={{ maxHeight: '300px', overflow: 'auto' }} >
                    <h5>{zvanje} {titula} {nastavnik.ime} {nastavnik.prezime}</h5>

                    {
                        tabelaZvanja
                    }

                    {
                        tabelaTitula
                    }
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
                <Table style={{ marginTop: '10px' }}>
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
                                    <TableRow key={podatak.id + '-' + fakultet.id}>
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

                    <Table>
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

                                <TextField
                                    onChange={(e) => {
                                        const filter = e.target.value.toLowerCase();
                                        this.setState({
                                            filterNastavnici: filter,
                                        });
                                    }}
                                    value={this.state.filterNastavnici}
                                    label="Претрага"
                                    style={{ marginBottom: '20px' }}
                                />

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
                                        if (this.state.selektovaniNastavnik === null) {
                                            return '';
                                        }

                                        const selektovaniNastavnik = { ...this.state.selektovaniNastavnik }

                                        let zvanje = '';
                                        let titula = '';

                                        if (selektovaniNastavnik.zvanja.length > 0) {
                                            zvanje = selektovaniNastavnik.zvanja[0].naziv + ' ';
                                        }

                                        if (selektovaniNastavnik.titule.length > 0) {
                                            titula = selektovaniNastavnik.titule[0].naziv + ' ';
                                        }

                                        return zvanje + titula + selektovaniNastavnik.ime + ' ' + selektovaniNastavnik.prezime;
                                    }}
                                >

                                    {
                                        this.state.ucitaniPodaci.nastavnici
                                            .filter(nastavnik => {
                                                const filter = this.state.filterNastavnici.trim().toLowerCase();
                                                if (filter === '') {
                                                    return true;
                                                }
                                                return nastavnik.ime.trim().toLowerCase().includes(filter)
                                                    || nastavnik.prezime.trim().toLowerCase().includes(filter);
                                            })
                                            .map(nastavnik => {
                                                let zvanje = '';
                                                let titula = '';

                                                if (nastavnik.zvanja.length > 0) {
                                                    zvanje = nastavnik.zvanja[0].naziv + ' ';
                                                }

                                                if (nastavnik.titule.length > 0) {
                                                    titula = nastavnik.titule[0].naziv + ' ';
                                                }
                                                return (
                                                    <MenuItem
                                                        key={nastavnik.id}
                                                        value={nastavnik.id}>
                                                        {zvanje} {titula} {nastavnik.ime} {nastavnik.prezime}
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


                                <TextField
                                    onChange={(e) => {
                                        const filter = e.target.value.toLowerCase();
                                        this.setState({
                                            filterFakulteti: filter,
                                        });
                                    }}
                                    value={this.state.filterFakulteti}
                                    label="Претрага"
                                    style={{ marginBottom: '20px' }}
                                />

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
                                        if (this.state.selektovaniFakultet === null) {
                                            return '';
                                        }
                                        return this.state.selektovaniFakultet.naziv;
                                    }}
                                >
                                    {
                                        this.state.ucitaniPodaci.fakulteti
                                            .filter(f => {
                                                const filter = this.state.filterFakulteti.trim().toLowerCase();
                                                if (filter === '') {
                                                    return true;
                                                }

                                                return f.naziv.toLowerCase().includes(filter)
                                                    || f.maticniBroj.toLowerCase().includes(filter)
                                                    || f.poreskiBroj.toLowerCase().includes(filter);
                                            })
                                            .map(fakultet => {
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
                                        id="datumOd"
                                    />
                                    <FormHelperText>Датум од када руководилац постаје активан</FormHelperText>
                                </div>

                                <div>
                                    Датум до:
                                <TextField
                                        fullWidth
                                        type='date'
                                        id="datumDo"
                                    />
                                    <FormHelperText>Датум до када је руководилац активан</FormHelperText>
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

                <h2 className="text-center">Постави руководиоца факултета</h2>
                
                <WithAuth>
                    {content}
                </WithAuth>

                <Growl ref={(el) => { this.growl = el }} />

            </div>
        );
    }
}

KreiranjeNovogRukovodioca.defaultProps = {
    fakultet: null,
}

export default KreiranjeNovogRukovodioca;