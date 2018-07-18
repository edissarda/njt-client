import React, { Component } from 'react';
import { loadingIcon } from './../common/loading'
import axios from 'axios'
import PrikazIzabranogNastavnika from './PrikazIzabranogNastavnika';
import { Select, MenuItem, Button } from '@material-ui/core';
import { Growl } from 'primereact/components/growl/Growl'
import WithAuth from '../hoc/WithAuth';

class DodajTituluNastavniku extends Component {
    state = {
        titule: [],
        izabranaTitula: null,

        nastavnik: null,

        loading: true,
        hasError: false,
    }

    async componentDidMount() {
        await this.ucitajPotrebnePodatke();
    }

    ucitajPotrebnePodatke = async () => {
        this.setState({
            titule: [],
            izabranaTitula: null,

            nastavnik: null,

            loading: true,
            hasError: false,
        });

        await this.loadData('titula', 'titule');
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

    dodajTitulu = (e) => {
        e.preventDefault();

        if (this.state.izabranaTitula === null) {
            this.showMessage('Изаберите титулу', 'error');
            return false;
        }

        const titula = {
            ...this.state.izabranaTitula
        }

        axios.post('nastavnik/' + this.state.nastavnik.id + '/titula', titula)
            .then(resp => {
                if (resp.data.status === 200) {
                    this.showMessage('Титула је успешно постављена');

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

                <form onSubmit={this.dodajTitulu}>
                    <div className="row">

                        <div className="col-12">
                            <div className="text-center">
                                <PrikazIzabranogNastavnika id={this.props.nastavnikId} />
                            </div>
                        </div>

                        <div className="col-6">
                        </div>

                        <div className="col-4">
                            <h3>Нова титула</h3>

                            <Select
                                fullWidth
                                renderValue={() => {
                                    return this.state.izabranaTitula != null ? this.state.izabranaTitula.naziv : '';
                                }}
                                onChange={(e) => {
                                    const titulaId = e.target.value;
                                    const titulaIndex = this.state.titule.findIndex(t => t.id === titulaId);
                                    if (titulaIndex >= 0) {
                                        const titula = {
                                            ...this.state.titule[titulaIndex]
                                        }
                                        this.setState({
                                            izabranaTitula: titula
                                        })
                                    } else {
                                        this.setState({
                                            izabranaTitula: null,
                                        })
                                    }
                                }}
                                value="Titula"
                            >
                                {
                                    this.state.titule.map(titula => {
                                        return (
                                            <MenuItem key={titula.id} value={titula.id}>
                                                {titula.naziv}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>

                        </div>

                        <Button type="submit" variant="contained" style={{ marginTop: '30px' }}>
                            Додај титулу
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
                <h2 className="text-center">Постави нову титулу наставнику</h2>

                <WithAuth>
                    {content}
                </WithAuth>

                <Growl ref={(e) => this.growl = e} />

            </div>
        );
    }
}

DodajTituluNastavniku.defaultProps = {
    nastavnikId: 0,
}

export default DodajTituluNastavniku;