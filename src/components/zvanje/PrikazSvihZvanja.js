import React, { Component } from 'react';
import axios from 'axios';
import NapraviZvanje from './NapraviZvanje';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { TextField, Button } from '@material-ui/core';
import { Growl } from 'primereact/components/growl/Growl';
import { Dialog } from '@material-ui/core';
import { loadingIcon } from './../common/loading';
import { createIcon, editIcon, deleteIcon, refreshIcon, searchIcon } from './../common/icons';
import IzmenaZvanja from './IzmenaZvanja';
import TooltipButton from '../common/TooltipButton';
import CloseButton from '../common/CloseButton';
import WithAuth from '../hoc/WithAuth';

const uri = 'zvanje/';

class ListaZvanja extends Component {

    state = {
        zvanja: null,
        hasError: false,
        prikaziModalKreirajZvanje: false,
        prikaziModalIzmeniZvanje: false,
        prikaziModalObrisiZvanje: false,
        selektovanoZvanje: null,
        pretragaFilter: null,
    }

    componentDidMount() {
        this.ucitajZvanja();
    }

    ucitajZvanja = () => {
        axios.get(uri).then(resp => {
            this.setState({
                zvanja: resp.data.data,
                selektovanoZvanje: null,
            });
        }).catch(() => {
            this.setState({ hasError: true });
        });
    }

    deselektujZvanje = () => {
        this.setState({
            selektovanoZvanje: null,
        });
    }

    zatvoriModalKreirajZvanje = () => {
        this.setState({
            prikaziModalKreirajZvanje: false,
        });
    }

    zatvoriModalIzmeniZvanje = () => {
        this.setState({
            prikaziModalIzmeniZvanje: false,
        });
    }

    showMessage = (details, summary = null, msgType = 'success') => {
        this.growl.show({ severity: msgType, summary: summary, detail: details, life: 5000 });
    }

    zvanjeDeleted = () => {
        this.deselektujZvanje();
        this.ucitajZvanja();
    }

    openCreateZvanjeModal = () => {
        this.setState({
            prikaziModalKreirajZvanje: true,
        });
    }

    napraviZvanje = (zvanje) => {
        axios.post(uri, zvanje).then(resp => {
            const status = resp.data.status;
            if (status === 200) {
                this.ucitajZvanja();
                this.showMessage('Звање ' + zvanje.naziv + ' је успешно креирано');
                this.zatvoriModalKreirajZvanje();
            } else {
                this.showMessage(resp.data.message, '', 'error');
            }
        }).catch(error => {
            this.showMessage(error.response.data.error, 'Грешка', 'error');
        });
    }

    obrisiZvanje = () => {
        if (this.state.selektovanoZvanje == null) {
            this.showMessage('Изаберите звање које желите да обришете', '', 'warn');
            return false;
        }

        const zvanje = {
            ...this.state.selektovanoZvanje
        }

        axios.delete(uri + zvanje.id).then(response => {
            const status = response.data.status;
            if (status === 200) {
                this.showMessage('Звање ' + response.data.data.naziv + ' је успешно обрисано.');
                this.zvanjeDeleted();
            } else {
                this.showMessage(response.data.message, null, 'error');
            }
        }).catch((error) => {
            this.showMessage(error.response.data.error, 'Грешка', 'error');
        });

        this.setState({
            prikaziModalObrisiZvanje: false,
        });
    }

    otvoriIzmeniZvanjeModal = () => {
        if (this.state.selektovanoZvanje == null) {
            this.showMessage('Изаберите звање које желите да измените', '', 'warn')
            return false;
        }

        this.setState({
            prikaziModalIzmeniZvanje: true,
        });
    }

    azurirajZvanje = (zvanje) => {
        axios.put(uri + zvanje.id, zvanje).then(resp => {
            const status = resp.data.status;

            if (status === 200) {
                this.ucitajZvanja();
                this.showMessage('Звање је успешно ажурирано.');
                this.zatvoriModalIzmeniZvanje();
            } else {
                this.showMessage(resp.data.message, null, 'error');
            }

        }).catch((error) => {
            this.showMessage(error.response.data.error, 'Грешка', 'error');
        });
    }

    selektujZvanje = (e) => {
        this.setState({
            selektovanoZvanje: e.data,
        });
    }

    getTableHeader = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="pull-left">
                    <TooltipButton
                        tooltip="Освежи приказ"
                        onClick={this.ucitajZvanja}
                    >
                        {refreshIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Креирај ново звање"
                        onClick={this.openCreateZvanjeModal}
                    >
                        {createIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Измени звање"
                        onClick={this.otvoriIzmeniZvanjeModal}
                    >
                        {editIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Обриши звање"
                        onClick={() => {
                            if (this.state.selektovanoZvanje === null) {
                                this.showMessage('Изаберите звање', null, 'warn');
                                return false;
                            }

                            this.setState({ prikaziModalObrisiZvanje: true })
                        }}
                    >
                        {deleteIcon}
                    </TooltipButton>
                </div>
                <div className="text-right">
                    <TextField
                        type="text"
                        onChange={(e) => this.setState({ pretragaFilter: e.target.value })}
                        label="Претрага"
                        InputProps={{
                            endAdornment: searchIcon,
                        }}
                    />
                </div>

            </div>
        );
    }

    render() {
        let content = null;

        if (this.state.zvanja == null && !this.state.hasError) {
            content = (<div className="text-center">{loadingIcon}</div>);
        } else if (this.state.hasError) {
            content = (<h5 className="text-center">Грешка приликом учитавања звања!</h5>);
        } else if (this.state.zvanja != null) {
            content = (
                <React.Fragment>

                    <div className="content-section implementation">
                        <Growl ref={el => this.growl = el}></Growl>

                        <DataTable
                            value={this.state.zvanja}
                            paginator={true}
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            selectionMode="single"
                            selection={this.state.selektovanoZvanje}
                            onSelectionChange={this.selektujZvanje}
                            resizableColumns={true}
                            globalFilter={this.state.pretragaFilter}
                            header={this.getTableHeader()}
                        >
                            <Column field="id" header="ИД" sortable style={{ width: '20%' }} />
                            <Column field="naziv" header="Назив" sortable />
                        </DataTable>
                    </div>

                </React.Fragment>
            );
        }

        return (
            <div>
                <h2 className="text-center">Звања</h2>

                {content}

                <Dialog
                    open={this.state.prikaziModalKreirajZvanje}
                    onClose={() => this.setState({ prikaziModalKreirajZvanje: false })}
                >
                    <div style={{ padding: '30px' }}>
                        <WithAuth>
                            <NapraviZvanje napraviZvanje={this.napraviZvanje} />
                        </WithAuth>
                    </div>
                </Dialog>

                <Dialog
                    open={this.state.prikaziModalIzmeniZvanje}
                    onClose={() => this.setState({ prikaziModalIzmeniZvanje: false })}
                >
                    <div style={{ padding: '30px' }}>
                        <WithAuth>
                            <IzmenaZvanja
                                zvanje={this.state.selektovanoZvanje}
                                onNazivZvanjaChange={this.nazivZvanjaChanged}
                                azurirajZvanje={this.azurirajZvanje}
                            />
                        </WithAuth>

                        <CloseButton onClick={() => this.setState({ prikaziModalIzmeniZvanje: false })} />
                    </div>
                </Dialog>

                <Dialog
                    open={this.state.prikaziModalObrisiZvanje}
                    onClose={() => this.setState({ prikaziModalObrisiZvanje: false })}
                >
                    <div style={{ padding: '30px' }}>
                        <WithAuth>
                            <div>
                                Да ли сте сигурни да желите да обришете изабрано звање?

                                <div>
                                    <Button onClick={() => this.setState({ prikaziModalObrisiZvanje: false })}>
                                        Не
                                    </Button>

                                    <Button onClick={this.obrisiZvanje} variant="text" color="secondary">
                                        Да, обриши звање
                                    </Button>
                                </div>
                            </div>
                        </WithAuth>
                    </div>
                </Dialog>

            </div>
        );


    }

    nazivZvanjaChanged = (e) => {
        const zvanje = {
            ...this.state.selektovanoZvanje,
            naziv: e.target.value
        }

        this.setState({
            selektovanoZvanje: zvanje,
        });
    }
}

export default ListaZvanja;