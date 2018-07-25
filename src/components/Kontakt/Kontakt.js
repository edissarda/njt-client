import React, { Component } from 'react';
import { emailIcon, githubIcon } from '../common/icons';
import { Table, TableBody, TableRow, TableCell, Paper, TextField, Button } from '@material-ui/core'
import axios from 'axios'
import { Growl } from 'primereact/components/growl/Growl'
import { loadingIcon } from './../common/loading'

class Kontakt extends Component {

    state = {
        sending: false,
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setSending();

        const poruka = {
            ime: e.target.ime.value.trim(),
            email: e.target.email.value.trim(),
            naslov: e.target.naslov.value.trim(),
            poruka: e.target.poruka.value.trim(),
        }

        this.posaljiPoruku(poruka);
    }

    posaljiPoruku = (poruka) => {
        axios.post('kontakt', poruka).then(resp => {
            if (resp.data.status === 200) {
                this.showMessage('Порука је успешно послата');
                this.setSending(false);
            } else {
                this.showMessage(resp.data.message, 'error');
                this.setSending(false);
            }
        }).catch(err => {
            this.showMessage('Дошло је до грешке. ' + err, 'error');
            this.setSending(false);
        });
    }

    setSending = (active = true) => {
        this.setState({
            sending: active,
        });
    }

    showMessage = (msg, severity = 'success', detail = null) => {
        this.growl.show({ severity: severity, summary: msg, detail: detail, life: 5000 });
    }

    renderContactInfo = () => {
        return (
            <Paper style={{ marginTop: '30px', marginBottom: '50px', padding: '20px' }}>
                <h3 className="text-center">Контакт подаци</h3>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ width: '5px' }}>{emailIcon}</TableCell>
                            <TableCell>edissarda@yahoo.com</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell style={{ width: '5px' }}>{githubIcon}</TableCell>
                            <TableCell><a href="http://github.com/edissarda" rel="noopener noreferrer" target="_blank" >edissarda</a></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    renderContactForm = () => {
        return (
            <Paper style={{ padding: '20px' }}>
                <h3 className="text-center">Контакт форма</h3>

                <form onSubmit={this.handleSubmit}>

                    <div>

                        <TextField
                            type="text"
                            id="ime"
                            label="Име и презиме"
                            autoComplete="off"
                            fullWidth
                        />
                    </div>

                    <div>
                        <TextField
                            type="email"
                            id="email"
                            fullWidth
                            label="Имејл"
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <TextField
                            type="text"
                            id="naslov"
                            fullWidth
                            label="Наслов поруке"
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <TextField
                            label="Порука"
                            fullWidth
                            id="poruka"
                            rows={4}
                            multiline={true}
                        />
                    </div>

                    <Button variant="contained" type="submit" style={{ marginTop: '30px' }}>
                        Пошаљи поруку
                        {this.state.sending ? loadingIcon : ''}
                    </Button>

                </form>
            </Paper>
        );
    }

    render() {
        return (
            <div>
                {
                    this.renderContactInfo()
                }

                {
                    this.renderContactForm()
                }

                <Growl ref={(e) => this.growl = e} />
            </div>
        );
    }
}

export default Kontakt;