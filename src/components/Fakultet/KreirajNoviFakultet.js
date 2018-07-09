import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import { Growl } from 'primereact/components/growl/Growl';
import { InputText } from 'primereact/components/inputtext/InputText';

const vrsteOrganizacijaUri = 'vrsta-organizacije';
const pravneFormeUri = 'pravna-forma';
const naucneOblastiUri = 'naucna-oblast';

const uri = 'fakultet/';
class KreirajNoviFakultet extends Component {

    state = {
        vrsteOrganizacija: [],
        pravneForme: [],
        naucneOblasti: [],
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
            id: e.target.vrstaOrganizacije.value,
            naziv: e.target.vrstaOrganizacije.options[e.target.vrstaOrganizacije.options.selectedIndex].text,
        }
        const pravnaForma = {
            id: e.target.pravnaForma.value,
            naziv: e.target.pravnaForma.options[e.target.pravnaForma.options.selectedIndex].text,
        }
        const naucnaOblast = {
            id: e.target.naucnaOblast.value,
            naziv: e.target.naucnaOblast.options[e.target.naucnaOblast.options.selectedIndex].text,
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

    async componentDidMount() {
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

                    <div className="form-group">
                        <span className="ui-float-label">
                            <InputText 
                                type="text"
                                className="form-control"
                                id="naziv"
                                autoComplete="off"
                            />
                            <label htmlFor="naziv">Назив</label>
                        </span>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <span className="ui-float-label">
                                    <InputText
                                        type="text"
                                        className="form-control"
                                        id="maticniBroj"
                                        autoComplete="off"
                                    />
                                    <label htmlFor="maticniBroj">Матични број</label>
                                </span>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="form-group">
                                <span className="ui-float-label">
                                    <InputText type="text"
                                        className="form-control"
                                        id="poreskiBroj"
                                        autoComplete="off"
                                    />
                                    <label htmlFor="poreskiBroj">Порески број</label>
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="form-group">
                        <textarea className="form-control" id="opis" placeholder="Опис"s></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="vrsta-organizacije">Врста организације</label>
                        <select className="form-control" id="vrstaOrganizacije">
                            {
                                this.state.vrsteOrganizacija.map(vo => {
                                    return (
                                        <option key={vo.id} value={vo.id}>{vo.naziv}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pravna-forma">Правна форма</label>
                        <select className="form-control" id="pravnaForma">
                            {
                                this.state.pravneForme.map(pf => {
                                    return (
                                        <option key={pf.id} value={pf.id}>{pf.naziv}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="naucna-oblast">Научна област</label>
                        <select className="form-control" id="naucnaOblast">
                            {
                                this.state.naucneOblasti.map(no => {
                                    return (
                                        <option key={no.id} value={no.id}>{no.naziv}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <button type="submit" className="btn btn-block btn-success">Сачувај</button>
                </form>
            </div>
        );
    }

    render() {
        let content = null;

        if (this.state.loading) {
            content = (
                <div className="text-center">
                    <h4>Учитавање потребних података је у току...</h4>
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