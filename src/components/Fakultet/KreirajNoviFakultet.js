import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import { Growl } from 'primereact/components/growl/Growl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const vrsteOrganizacijaUri = 'vrsta-organizacije';
const pravneFormeUri = 'pravna-forma';
const naucneOblastiUri = 'naucna-oblast';

const uri = 'fakultet/';
class KreirajNoviFakultet extends Component {

    state = {
        vrsteOrganizacija: [],
        pravneForme: [],
        naucneOblasti: [],
        izabranaVrstaOrganizacije: null,
        izabranaPravnaForma: null,
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
            naucnaOblast
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
        await axios.get(vrsteOrganizacijaUri).then(response => {
            const resp = response.data;

            if (resp.status === 200) {
                this.setVrstaOrganizacija(resp.data);
            } else {
                this.setError();
            }
        }).catch(() => {
            this.setError();
        });

        await axios.get(pravneFormeUri).then(response => {
            const resp = response.data;

            if (resp.status === 200) {
                this.setPravneForme(resp.data);
            } else {
                this.setError();
            }
        }).catch(() => {
            this.setError();
        });

        await axios.get(naucneOblastiUri).then(response => {
            const resp = response.data;

            if (resp.status === 200) {
                this.setNaucneOblasti(resp.data);
            } else {
                this.setError();
            }
        }).catch(() => {
            this.setError();
        });

        this.setKrajUcitavanja();
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
            hasError: errorExists || false,
        });
    }

    getForm = () => {
        return (
            <div className="col-12" style={{ marginTop: '30px', marginBottom: '30px' }}>
                <form onSubmit={this.handleSubmit}>

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


                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col-4">
                            <label htmlFor="vrstaOrganizacijePretraga">&nbsp;</label>
                            <TextField
                                id="vrstaOrganizacijePretraga"
                                type="text"
                                autoComplete="off"
                                fullWidth
                                placeholder="Претрага"
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
                                        const vrstaOrg = this.state.vrsteOrganizacija[index];
                                        this.setState({
                                            izabranaVrstaOrganizacije: vrstaOrg
                                        });
                                    }
                                }}
                                id="vrstaOrganizacije"
                                fullWidth
                                displayEmpty
                            >
                                {
                                    this.state.vrsteOrganizacija.map(vo => {
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
                                        const naucnaOblast = this.state.naucneOblasti[index];
                                        this.setState({
                                            izabranaNaucnaOblast: {
                                                id: naucnaOblast.id,
                                                naziv: naucnaOblast.naziv
                                            },
                                        })
                                    }
                                }}
                                fullWidth

                            >
                                {
                                    this.state.naucneOblasti.map(no => {
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
                                            const pravnaForma = this.state.pravneForme[index];
                                            this.setState({
                                                izabranaPravnaForma: pravnaForma
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

                    <Button type='submit' fullWidth variant="contained" color="default">
                        Сачувај
                    </Button>
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
                    {this.getForm()}
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