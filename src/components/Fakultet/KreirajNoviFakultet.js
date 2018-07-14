import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import { Growl } from 'primereact/components/growl/Growl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from '@material-ui/core';
import { refreshIcon, createIcon } from '../common/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import TooltipButton from '../common/TooltipButton';

const vrsteOrganizacijaUri = 'vrsta-organizacije';
const pravneFormeUri = 'pravna-forma';
const naucneOblastiUri = 'naucna-oblast';

const uri = 'fakultet/';
class KreirajNoviFakultet extends Component {

    state = {
        vrsteOrganizacija: [],
        pravneForme: [],
        naucneOblasti: [],
        tipoviPodataka: [],

        dodatiPodaci: [],
        vrednostNovogPodatka: '',
        indeksPoslednjegDodatogPodatka: 0,
        selektovaniTipPodatka: null,

        filterVrstaOrganizacije: '',
        izabranaVrstaOrganizacije: null,

        izabranaPravnaForma: null,

        filterNaucnaOblast: '',
        izabranaNaucnaOblast: null,

        loading: true,
        hasError: false,

    }

    handleSubmit = (e) => {
        e.preventDefault();

        const naziv = e.target.naziv.value.trim();
        const maticniBroj = e.target.maticniBroj.value.trim();
        const pib = e.target.poreskiBroj.value.trim();
        const opis = e.target.opis.value.trim();
        const vrstaOrganizacije = {
            ...this.state.izabranaVrstaOrganizacije
        }
        const pravnaForma = {
            ...this.state.izabranaPravnaForma
        }
        const naucnaOblast = {
            ...this.state.izabranaNaucnaOblast
        }

        const fakultet = {
            naziv,
            maticniBroj,
            poreskiBroj: pib,
            opis,
            vrstaOrganizacije,
            pravnaForma,
            naucnaOblast,
            podaci: this.state.dodatiPodaci,
        }

        this.kreirajFakultet(fakultet);
    }

    // slanje POST zahteva za cuvanje fakulteta u bazu
    kreirajFakultet = (fakultet) => {
        axios.post(uri, fakultet).then(response => {
            if (response.data.status === 200) {
                this.showMessage('Факултет је успешно сачуван');
            } else {
                this.showMessage(response.data.message, 'error');
            }
        }).catch(() => {
            this.showMessage('Дошло је до грешке приликом чувања факултета', 'error');
        });
    }

    showMessage = (msg, type = 'success', title = null) => {
        this.growl.show({ severity: type, summary: title, detail: msg });
    }

    componentDidMount() {
        this.ucitajPotrebnePodatke();
    }

    ucitajPotrebnePodatke = async () => {

        this.ucitajTipovePodataka();

        try {
            const vrsteOrganizacijaResp = await axios.get(vrsteOrganizacijaUri);
            const pravneFormeResp = await axios.get(pravneFormeUri);
            const naucneOblastiResp = await axios.get(naucneOblastiUri);

            if (vrsteOrganizacijaResp.data.status === 200
                && pravneFormeResp.data.status === 200
                && naucneOblastiResp.data.status === 200) {
                this.setState({
                    vrsteOrganizacija: vrsteOrganizacijaResp.data.data,
                    pravneForme: pravneFormeResp.data.data,
                    naucneOblasti: naucneOblastiResp.data.data,
                });
            } else {
                this.setError();
            }

        } catch (error) {
            this.setError();
        }

        this.setKrajUcitavanja();
    }

    ucitajTipovePodataka = async () => {
        const tipoviPodatakaResp = await axios.get('tip-podatka');

        if (tipoviPodatakaResp.data.status === 200) {
            this.setState({
                tipoviPodataka: tipoviPodatakaResp.data.data,
            })
        }
    }

    setVrstaOrganizacija = (data) => {
        this.setState({
            vrsteOrganizacija: data,
        });
    }

    setPravneForme = (data) => {
        this.setState({
            pravneForme: data,
        });
    }

    setNaucneOblasti = (data) => {
        this.setState({
            naucneOblasti: data,
        });
    }

    setError = () => {
        this.setState({
            hasError: true,
            loading: false,
        });
    }

    setKrajUcitavanja = () => {
        const errorExists = this.state.hasError;

        this.setState({
            loading: false,
            hasError: errorExists,
        });
    }

    renderDodatiPodaci = () => {
        if (this.state.dodatiPodaci.length === 0) {
            return null;
        }

        return (
            <Paper style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Вредност</TableCell>
                            <TableCell>Тип податка</TableCell>
                            <TableCell>Акција</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {
                            this.state.dodatiPodaci.map(podatak => {
                                return (
                                    <TableRow>
                                        <TableCell>{podatak.vrednost}</TableCell>
                                        <TableCell>{podatak.tipPodatka.naziv}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => {
                                                const podatakId = podatak.id;
                                                const noviPodaci = this.state.dodatiPodaci.filter(p => p.id !== podatakId);

                                                this.setState({
                                                    dodatiPodaci: noviPodaci,
                                                });
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }

                    </TableBody>
                </Table>
            </Paper>
        );

    }

    renderFormuZaDodavanjeNovogPodatka = () => {
        return (
            <Paper>
                <div style={{ padding: '20px', marginTop: '20px' }}>

                    <h5>Додатни подаци о факултету</h5>

                    <div className="row">
                        <div className="col-4">
                            <TextField
                                placeholder='Вредност'
                                fullWidth
                                id='novaVrednost'
                                value={this.state.vrednostNovogPodatka}
                                onChange={(e) => this.setState({ vrednostNovogPodatka: e.target.value.trim() })}
                            />
                        </div>

                        <div className="col-4">
                            <Select
                                fullWidth
                                value={(this.state.selektovaniTipPodatka != null) ? this.state.selektovaniTipPodatka.naziv : ''}
                                renderValue={() => (this.state.selektovaniTipPodatka != null) ? this.state.selektovaniTipPodatka.naziv : ''}
                                onChange={(e) => {
                                    const idTipaPodatka = e.target.value;

                                    const tipPodatka = {
                                        ...this.state.tipoviPodataka.find(tp => tp.id === idTipaPodatka),
                                    }

                                    this.setState({
                                        selektovaniTipPodatka: tipPodatka
                                    })
                                }}
                            >
                                {
                                    this.state.tipoviPodataka.map(tipPodatka => {
                                        return <MenuItem key={tipPodatka.id} value={tipPodatka.id}>{tipPodatka.naziv}</MenuItem>
                                    })
                                }
                            </Select>
                        </div>

                        <div className="col-4">

                            <TooltipButton
                                tooltip='Додај податак'
                                onClick={
                                    () => {
                                        const podatak = {
                                            id: this.state.indeksPoslednjegDodatogPodatka + 1,
                                            vrednost: this.state.vrednostNovogPodatka.trim(),
                                            tipPodatka: this.state.selektovaniTipPodatka,
                                        }

                                        if (podatak.vrednost.trim() === '') {
                                            this.showMessage('Вредност не сме бити празна.', 'warn');
                                            return false;
                                        }

                                        if (podatak.tipPodatka == null) {
                                            this.showMessage('Морате изабрати тип податка', 'warn');
                                            return false;
                                        }

                                        const noviPodaci = [...this.state.dodatiPodaci];
                                        noviPodaci.push(podatak);

                                        this.setState({
                                            dodatiPodaci: noviPodaci,
                                            indeksPoslednjegDodatogPodatka: podatak.id + 1,
                                            vrednostNovogPodatka: '',
                                            selektovaniTipPodatka: null,
                                        })

                                    }
                                }
                            >
                                {createIcon}
                            </TooltipButton>


                            <TooltipButton
                                onClick={this.ucitajTipovePodataka}
                                tooltip="Освежи типове вредности"
                            >
                                {refreshIcon}
                            </TooltipButton>
                        </div>
                    </div>

                    {
                        this.renderDodatiPodaci()
                    }

                </div>
            </Paper>
        );
    }

    renderForm = () => {
        return (
            <div className="col-12" style={{ marginTop: '30px', marginBottom: '30px' }}>

                <form onSubmit={this.handleSubmit}>

                    <Paper style={{ padding: '20px', marginBottom: '20px' }}>

                        <h5>Основни подаци</h5>

                        <div className="row">
                            <div className="col-4">
                                <TextField
                                    type="text"
                                    id="naziv"
                                    autoComplete="off"
                                    label="Назив"
                                    fullWidth
                                />
                            </div>

                            <div className="col-4">
                                <TextField
                                    type="text"
                                    id="maticniBroj"
                                    autoComplete="off"
                                    label="Матични број"
                                    fullWidth
                                />
                            </div>

                            <div className="col-4">
                                <TextField
                                    type="text"
                                    id="poreskiBroj"
                                    label="Порески број"
                                    style={{ width: '100%' }}
                                    autoComplete="off"
                                    fullWidth
                                />
                            </div>
                        </div>


                        <div className="form-group">
                            <TextField
                                fullWidth
                                multiline
                                id="opis"
                                label="Опис"
                                rows={3}
                            />
                        </div>

                    </Paper>

                    <Paper style={{ padding: '20px' }}>
                        <div className="row" style={{ marginBottom: '20px' }}>
                            <div className="col-4">
                                <label htmlFor="vrstaOrganizacijePretraga">&nbsp;</label>
                                <TextField
                                    id="vrstaOrganizacijePretraga"
                                    type="text"
                                    autoComplete="off"
                                    fullWidth
                                    placeholder="Претрага"
                                    onChange={(e) => {
                                        this.setState({
                                            filterVrstaOrganizacije: e.target.value.toLowerCase(),
                                        });
                                    }}
                                    value={this.state.filterVrstaOrganizacije}
                                />
                            </div>

                            <div className="col-8">
                                <label htmlFor="">Врста организације</label>
                                <Select
                                    value="Врста организације"
                                    renderValue={() => {
                                        return (this.state.izabranaVrstaOrganizacije != null)
                                            ?
                                            this.state.izabranaVrstaOrganizacije.naziv
                                            :
                                            '';
                                    }}
                                    onChange={(e) => {
                                        const index = this.state.vrsteOrganizacija.findIndex(vo => vo.id === e.target.value);
                                        if (index >= 0) {
                                            const vrstaOrg = { ...this.state.vrsteOrganizacija[index] };
                                            this.setState({
                                                izabranaVrstaOrganizacije: vrstaOrg
                                            });
                                        } else {
                                            this.setState({
                                                izabranaVrstaOrganizacije: null,
                                            });
                                        }
                                    }}
                                    id="vrstaOrganizacije"
                                    fullWidth
                                    displayEmpty
                                >
                                    {
                                        this.state.vrsteOrganizacija
                                            .filter(vo => {
                                                const filterValue = this.state.filterVrstaOrganizacije.toLowerCase().trim();
                                                if (filterValue === '') {
                                                    return true;
                                                }
                                                return vo.naziv.toLowerCase().includes(filterValue);
                                            })
                                            .map(vo => {
                                                return (
                                                    <MenuItem key={vo.id} value={vo.id}>{vo.naziv}</MenuItem>
                                                );
                                            })
                                    }
                                </Select>


                            </div>
                        </div>



                        <div className="row" style={{ marginBottom: '20px' }}>
                            <div className="col-4">
                                <label htmlFor="naucnaOblastPretraga">
                                    &nbsp;
                            </label>
                                <TextField
                                    id="naucnaOblastPretraga"
                                    type="text"
                                    placeholder="Претрага"
                                    autoComplete="off"
                                    fullWidth
                                    onChange={(e) => {
                                        this.setState({
                                            filterNaucnaOblast: e.target.value.toLowerCase(),
                                        });
                                    }}
                                    value={this.state.filterNaucnaOblast}
                                />
                            </div>
                            <div className="col-8">
                                <label htmlFor="naucnaOblast">Научна област</label>
                                <Select
                                    value="Изаберите"
                                    renderValue={() => {
                                        return (this.state.izabranaNaucnaOblast != null)
                                            ? this.state.izabranaNaucnaOblast.naziv
                                            : '';
                                    }}
                                    onChange={(e) => {
                                        const index = this.state.naucneOblasti.findIndex(no => no.id === e.target.value);
                                        if (index >= 0) {
                                            const naucnaOblast = { ...this.state.naucneOblasti[index] };
                                            this.setState({
                                                izabranaNaucnaOblast: {
                                                    id: naucnaOblast.id,
                                                    naziv: naucnaOblast.naziv
                                                },
                                            })
                                        } else {
                                            this.setState({
                                                izabranaNaucnaOblast: null,
                                            });
                                        }
                                    }}
                                    fullWidth

                                >
                                    {
                                        this.state.naucneOblasti
                                            .filter(no => {
                                                const filterValue = this.state.filterNaucnaOblast.toLowerCase().trim();
                                                if (filterValue === '') {
                                                    return true;
                                                }
                                                return no.naziv.toLowerCase().includes(filterValue);
                                            })
                                            .map(no => {
                                                return (
                                                    <MenuItem key={no.id} value={no.id}>{no.naziv}</MenuItem>
                                                );
                                            })
                                    }
                                </Select>
                            </div>
                        </div>


                        <div className="row" style={{ marginBottom: '20px' }}>
                            <div className="col-4">
                                <label htmlFor="">&nbsp;</label>
                                <TextField
                                    type="text"
                                    placeholder="Претрага"
                                    autoComplete="off"
                                    fullWidth
                                />
                            </div>

                            <div className="col-8">
                                <div className="form-group">
                                    <label htmlFor="pravna-forma">Правна форма</label>
                                    <Select
                                        value="Правна форма"
                                        renderValue={() => {
                                            return this.state.izabranaPravnaForma != null
                                                ? this.state.izabranaPravnaForma.naziv
                                                : '';
                                        }}
                                        onChange={(e) => {
                                            const index = this.state.pravneForme.findIndex(pf => pf.id === e.target.value);
                                            if (index >= 0) {
                                                const pravnaForma = { ...this.state.pravneForme[index] };
                                                this.setState({
                                                    izabranaPravnaForma: pravnaForma
                                                });
                                            } else {
                                                this.setState({
                                                    izabranaPravnaForma: null,
                                                });
                                            }
                                        }}
                                        id="pravnaForma"
                                        fullWidth>
                                        {
                                            this.state.pravneForme.map(pf => {
                                                return (
                                                    <MenuItem key={pf.id} value={pf.id}>{pf.naziv}</MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </Paper>

                    {
                        this.renderFormuZaDodavanjeNovogPodatka()
                    }

                    <div style={{ marginTop: '50px' }}>
                        <Button type='submit' variant="contained">
                            Сачувај факултет
                        </Button>
                    </div>

                </form >
            </div >
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
                <h4 className="text-center">Дошло је до грешке приликом учитавања потребних података.</h4>
            );
        } else {
            content = (
                <React.Fragment>
                    <Growl ref={(el) => this.growl = el} />
                    {this.renderForm()}
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>

                <h2 className="text-center">Креирање новог факултета</h2>

                {content}
            </React.Fragment>
        );
    }
}

export default KreirajNoviFakultet;