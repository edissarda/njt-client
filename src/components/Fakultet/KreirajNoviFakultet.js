import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import { Growl } from 'primereact/components/growl/Growl';

const vrsteOrganizacijaUri = 'vrsta-organizacije';
const pravneFormeUri = 'pravna-forma';
const naucneOblastiUri = 'naucna-oblast';

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

        this.growl.show({ severity: 'info', summary: null, detail: e.target.naziv.value });
    }

    async componentDidMount() {
        await axios.get(vrsteOrganizacijaUri).then(response => {
            const resp = response.data;

            if (resp.status === 200) {
                this.setVrstaOrganizacija(resp.data);
                console.log(resp.data);
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
                console.log(resp.data);
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
                console.log(resp.data);
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
            <div className="col-12">
                <form onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="naziv">Назив</label>
                        <input type="text"
                            className="form-control"
                            id="naziv"
                            placeholder="Назив"
                            autoComplete="off"
                        />
                    </div>

                    <div className="row">
                        <div className="col-6">

                            <div className="">
                                <label htmlFor="naziv">Матични број</label>
                                <input type="text"
                                    className="form-control"
                                    id="maticni-broj"
                                    placeholder="Матични број"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="">
                                <label htmlFor="naziv">Порески број</label>
                                <input type="text"
                                    className="form-control"
                                    id="poreski-broj"
                                    placeholder="Порески број"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="form-group">
                        <label htmlFor="naziv">Опис</label>
                        <textarea className="form-control" id="opis" placeholder="Опис"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="vrsta-organizacije">Врста организације</label>
                        <select className="form-control" id="vrsta-organizacije">
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
                        <select className="form-control" id="pravna-forma">
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
                        <select className="form-control" id="naucna-oblast">
                            {
                                this.state.naucneOblasti.map(no => {
                                    return (
                                        <option key={no.id} value={no.id}>{no.naziv}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success">Сачувај</button>
                </form >
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