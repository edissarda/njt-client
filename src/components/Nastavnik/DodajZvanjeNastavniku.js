import React, { Component } from 'react';
import { loadingIcon } from './../common/loading'
import axios from 'axios'
import PrikazIzabranogNastavnika from './PrikazIzabranogNastavnika';
import { Select, MenuItem, Button } from '@material-ui/core';
import { Growl } from 'primereact/components/growl/Growl'
import WithAuth from '../hoc/WithAuth';

class DodajZvanjeNastavniku extends Component {
    state = {
        zvanja: [],
        izabranoZvanje: null,

        nastavnik: null,

        loading: true,
        hasError: false,
    }

    async componentDidMount() {
        await this.ucitajPotrebnePodatke();
    }

    ucitajPotrebnePodatke = async () => {
        this.setState({
            zvanja: [],
            izabranoZvanje: null,

            nastavnik: null,

            loading: true,
            hasError: false,
        });

        await this.loadData('zvanje', 'zvanja');
        await this.loadData('nastavnik/' + this.props.nastavnikId, 'nastavnik');

        this.setState({
            loading: false,
        });
    }

    loadData = async (uri, prop) => {
        if (this.state.hasError) {
            return false;
        }

        try {
            const resp = await axios.get(uri);

            if (resp.data.status === 200) {

                const newState = {
                    ...this.state
                }
                newState[prop] = resp.data.data;

                this.setState(newState);
            } else {
                this.setError();
            }
        } catch (error) {
            this.setError();
        }
    }

    setError = () => {
        this.setState({
            loading: false,
            hasError: true,
        });
    }

    showMessage = (msg, severity = 'success', detail = null) => {
        this.growl.show({ severity: severity, summary: msg, detail: detail, life: 10000 });
    }

    dodajZvanje = (e) => {
        e.preventDefault();

        if (this.state.izabranoZvanje === null) {
            this.showMessage('Изаберите звање', 'error');
            return false;
        }

        const zvanje = {
            ...this.state.izabranoZvanje
        }

        axios.post('nastavnik/' + this.state.nastavnik.id + '/zvanje', zvanje)
            .then(resp => {
                if (resp.data.status === 200) {
                    this.showMessage('Звање је успешно постављено');

                    setTimeout(this.ucitajPotrebnePodatke, 1000);

                } else {
                    this.showMessage(resp.data.message, 'error');
                }
            }).catch(err => {
                this.showMessage('Грешка. ' + err, 'error');
            });
    }

    renderContent = () => {
        return (
            <React.Fragment>

                <form onSubmit={this.dodajZvanje}>
                    <div className="row">

                        <div className="col-12">
                            <div className="text-center">
                                <PrikazIzabranogNastavnika id={this.props.nastavnikId} />
                            </div>
                        </div>

                        <div className="col-4">
                            <h3>Ново звање</h3>

                            <Select
                                fullWidth
                                renderValue={() => {
                                    return this.state.izabranoZvanje != null ? this.state.izabranoZvanje.naziv : '';
                                }}
                                onChange={(e) => {
                                    const zvanjeId = e.target.value;
                                    const zvanjeIndex = this.state.zvanja.findIndex(z => z.id === zvanjeId);
                                    if (zvanjeIndex >= 0) {
                                        const zvanje = {
                                            ...this.state.zvanja[zvanjeIndex]
                                        }
                                        this.setState({
                                            izabranoZvanje: zvanje
                                        })
                                    } else {
                                        this.setState({
                                            izabranoZvanje: null,
                                        })
                                    }
                                }}
                                value="Zvanje"
                            >
                                {
                                    this.state.zvanja.map(zvanje => {
                                        return (
                                            <MenuItem key={zvanje.id} value={zvanje.id}>
                                                {zvanje.naziv}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>

                        </div>

                        <Button type="submit" variant="contained" style={{ marginTop: '30px' }}>
                            Додај звање
                        </Button>
                    </div>

                </form>
            </React.Fragment>
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
                <h5 className="text-center">Дошло је до грешке приликом учитавања потребних података</h5>
            );
        } else {
            content = (
                <React.Fragment>
                    {
                        this.renderContent()
                    }
                </React.Fragment>
            );
        }

        return (
            <div>
                <h2 className="text-center">Постави ново звање наставнику</h2>

                <WithAuth>
                    {content}
                </WithAuth>

                <Growl ref={(e) => this.growl = e} />

            </div>
        );
    }
}

DodajZvanjeNastavniku.defaultProps = {
    nastavnikId: 0,
}

export default DodajZvanjeNastavniku;