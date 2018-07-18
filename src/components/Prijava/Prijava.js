import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { TextField, Button } from '@material-ui/core'
import { Growl } from '../../../node_modules/primereact/components/growl/Growl';

class Prijava extends Component {

    login = (e) => {
        e.preventDefault();

        const admin = {
            username: e.target.username.value.trim(),
            password: e.target.password.value.trim(),
        }

        this.sendLoginRequest(admin);
    }

    sendLoginRequest = (admin) => {
        axios.post('/auth/login', admin)
            .then(resp => {
                if (resp.data.status === 200) {
                    this.showMessage('Успешна пријава');
                    this.props.onPrijavaSuccess(resp.data.data);
                    this.props.history.push('/');
                } else {
                    this.showMessage(resp.data.message, 'error');
                }
            }).catch(err => {
                this.showMessage('Дошло је до грешке. ' + err, 'error');
            });
    }

    showMessage = (msg, severity = 'success', detail = null) => {
        this.growl.show({ severity: severity, summary: msg, detail: detail, life: 5000 });
    }

    renderForm = () => {
        if (this.props.admin != null) {
            return "Пријављени сте као " + this.props.admin.ime + ' ' + this.props.admin.prezime;
        }

        return (
            <div className="row">
                <div className="col-4">
                </div>

                <div className="col-4">
                    <form onSubmit={this.login}>
                        <TextField
                            label="Корисничко име"
                            id="username"
                            fullWidth
                            autoComplete="off"
                            autoFocus="on"
                        />

                        <TextField
                            type="password"
                            label="Шифра"
                            id="password"
                            fullWidth
                        />

                        <Button type="submit" variant="contained" style={{ marginTop: '30px' }}>
                            Пријави се
                        </Button>
                    </form>
                </div>

                <div className="col-4">
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h3 className="text-center">Пријава на систем</h3>
                {
                    this.renderForm()
                }

                <Growl ref={(e) => this.growl = e} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        admin: state.admin
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPrijavaSuccess: (admin) => dispatch({ type: 'LOGIN_SUCCESS', admin })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Prijava);