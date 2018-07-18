import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core'
import axios from 'axios'
import { Growl } from '../../../node_modules/primereact/components/growl/Growl';
import WithAuth from '../hoc/WithAuth';

const uri = 'nastavnik';

class KreirajNovogNastavnika extends Component {

    kreirajNastavnika = (e) => {
        e.preventDefault();

        const nastavnik = {
            ime: e.target.ime.value.trim(),
            prezime: e.target.prezime.value.trim(),
            brojRadneKnjizice: e.target.brojRadneKnjizice.value.trim(),
        }

        this.sacuvajNastavnika(nastavnik);
    }

    sacuvajNastavnika = (nastavnik) => {
        axios.post(uri, nastavnik).then(resp => {
            if (resp.data.status === 200) {
                this.showMessage('Наставник је успешно креиран');
            } else {
                this.showMessage(resp.data.message, 'error');
            }
        }).catch(err => {
            this.showMessage('Дошло је до грешке приликом креирања наставника. ' + err, 'error');
        });
    }

    showMessage = (msg, severity = 'success', detail = null) => {
        this.growl.show({ severity: severity, summary: msg, detail: detail, life: 5000 });
    }

    renderContent = () => {
        return (
            <React.Fragment>
                <form onSubmit={this.kreirajNastavnika}>

                    <TextField
                        id='ime'
                        label='Име'
                        autoComplete="off"
                        fullWidth
                    />

                    <TextField
                        id='prezime'
                        label='Презиме'
                        autoComplete="off"
                        fullWidth
                    />

                    <TextField
                        id="brojRadneKnjizice"
                        label="Број радне књижице"
                        autoComplete="off"
                        fullWidth
                    />

                    <Button type='submit' variant="contained" style={{ marginTop: '30px' }}>
                        Сачувај наставника
                    </Button>

                </form>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div>
                <h4 className="text-center">Креирање новог наставника</h4>

                <WithAuth>
                    {
                        this.renderContent()
                    }
                </WithAuth>

                <Growl ref={(e) => this.growl = e} />
            </div>
        );
    }
}

export default KreirajNovogNastavnika;